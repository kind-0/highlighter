import { writable, get as getStore, type Writable, readable, derived } from 'svelte/store';
import ndk from './ndk';
import { NDKEvent, NDKList, NDKSubscriptionCacheUsage, type NDKFilter, type NDKTag, type NDKUser } from '@nostr-dev-kit/ndk';
import type NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import { NDKListKinds } from '$lib/ndk-kinds';
import NDKHighlight from '$lib/ndk-kinds/highlight';
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { newArticles } from './articles';
import debug from 'debug';

const d = debug('highlighter:session');

export const loadingScreen = writable<boolean>(false);

/**
 * Current user logged-in
 */
export const user = writable<NDKUser | null>(null);

/**
 * Current user's follows
 */
export const userFollows = persist(
    writable<Set<string>>(new Set()),
    createLocalStorage(),
    'user-follows'
);

/**
 * Current user's lists
 */
export const userLists = writable<Map<string, NDKList>>(new Map());

export const highlights = writable<Map<string, NDKHighlight>>(new Map());

/**
 * Current user's followed hashtags
 */
export const userFollowHashtags = writable<string[]>([]);

/**
 * The user's extended network
 */
export const networkFollows = persist(
    writable<Set<string>>(new Set()),
    createLocalStorage(),
    'network-follows'
);

/**
 * The user's extended network lists
 */
export const networkLists = writable<Map<string, NDKList>>(new Map());

/**
 * Main entry point to prepare the session.
 */
export async function prepareSession(): Promise<void> {
    const $ndk = getStore(ndk);
    const $user = getStore(user);

    if (!$ndk || !$user) {
        return;
    }

    d(`running prepareSession`);

    return new Promise((resolve) => {
        const alreadyKnowFollows = getStore(userFollows).size > 0;

        console.log('before-follows', getStore(userFollows).size, getStore(userFollowHashtags).length);

        fetchData(
            'user',
            $ndk,
            [$user.hexpubkey()],
            {
                highlightStore: highlights,
                followsStore: userFollows,
                listsStore: userLists,
                followHashtagsStore: userFollowHashtags,
                waitUntilEoseToResolve: !alreadyKnowFollows,
                extraKinds: [0],
            }
        ).then(() => {
            const $userFollows = getStore(userFollows);

            console.log(`user follows count: ${$userFollows.size}`);
            console.log(`user lists count: ${getStore(userLists).size}`);
            console.log(`user hashtags: ${Object.keys(getStore(userFollowHashtags)).length}`);

            newArticles.ref();

            resolve();

            fetchData(
                'network',
                $ndk,
                Array.from($userFollows),
                {
                    highlightStore: highlights,
                    listsStore: networkLists,
                    listsKinds: [39802],
                    extraKinds: [0],
                }
            ).then(() => {
                console.log(`network lists count: ${getStore(networkLists).size}`);

                if (shouldFollowNetworkFollows()) {
                    fetchData(
                        'network-follows',
                        $ndk,
                        Array.from($userFollows),
                        {
                            followsStore: networkFollows,
                            listsStore: networkLists,
                            listsKinds: [39802],
                            closeOnEose: true,
                            waitUntilEoseToResolve: true
                        }
                    ).then(() => {
                        console.log(`network follows count: ${getStore(networkFollows).size}`);
                        localStorage.setItem('network-follows-updated-t', Date.now().toString());
                    });
                }
            });
        });
    });
}

function shouldFollowNetworkFollows() {
    // check if the user has more than 30k network follows or if the last update was more than 7d ago
    const lastUpdate = localStorage.getItem('network-follows-updated-t');
    const lastUpdateDate = lastUpdate ? new Date(parseInt(lastUpdate)) : null;

    if (lastUpdateDate && lastUpdateDate.getDate() > (new Date()).getDate() - 7) {
        return false;
    }

    return getStore(networkFollows).size < 10000;
}

function isHashtagListEvent(event: NDKEvent) {
    return (
        // event.kind === 30001 &&
        event.tagValue('d') === 'hashtags'
    );
}

interface IFetchDataOptions {
    highlightStore? : Writable<Map<string, NDKEvent>>;
    followsStore?: Writable<Set<string>>;
    listsStore?: Writable<Map<string, NDKList>>;
    listsKinds?: number[];
    extraKinds?: number[];
    followHashtagsStore?: Writable<string[]>;
    closeOnEose?: boolean;
    waitUntilEoseToResolve?: boolean;
}

/**
 * Fetches the information regarding the current user.
 * At this stage, we still don't know the user's network.
 *
 * * Protects from receiving multiple duplicated events
 * * Protects from unnecessarily calling updateFollows if the
 * * eventId is not different than something already processed
 */
async function fetchData(
    name: string,
    $ndk: NDKSvelte,
    authors: string[],
    opts: IFetchDataOptions
): Promise<void> {
    // set defaults
    opts.waitUntilEoseToResolve ??= true;
    opts.closeOnEose ??= false;
    opts.listsKinds ??= NDKListKinds;

    const mostRecentEvents: Map<string, NDKEvent> = new Map();
    let processedKind3Id: string | undefined = undefined;
    let kind3Key: string;
    let eosed = false;
    const _ = d.extend(`fetch:${name}`);

    _({waitUntilEoseToResolve: opts.waitUntilEoseToResolve});

    const processEvent = (event: NDKEvent) => {
        const dedupKey = event.deduplicationKey();
        const existingEvent = mostRecentEvents.get(dedupKey);

        if (existingEvent && event.created_at! < existingEvent.created_at!) {
            return;
        }

        mostRecentEvents.set(dedupKey, event);

        if (event.kind === 3 && opts.followsStore) {
            kind3Key = dedupKey;
            processKind3(event);
        } else if (event.kind === 9802 && opts.highlightStore) {
            processHighlight(event);
        } else if (isHashtagListEvent(event) && opts.followHashtagsStore) {
            processHashtagList(event);
        } else if (NDKListKinds.includes(event.kind!) && opts.listsStore) {
            processList(event);
        }
    };

    const processHighlight = (event: NDKEvent) => {
        const highlight = NDKHighlight.from(event);
        opts.highlightStore!.update((highlights) => {
            highlights.set(highlight.id, highlight);

            return highlights;
        });
    };

    /**
     * Called when a newer event of kind 3 is received.
     */
    const processKind3 = (event: NDKEvent) => {
        if (
            (eosed && event.id !== processedKind3Id) ||
            authors.length > 1 // if authors has more than one, add the received list
        ) {
            processedKind3Id = event.id;
            updateFollows(event);
        }
    };

    const processHashtagList = (event: NDKEvent) => {
        userFollowHashtags.update((existingHashtags) => {
            for (const t of event.tags) {
                if (t[0] === 't') {
                    if (existingHashtags instanceof Array) {
                        if (!existingHashtags.includes(t[1]))
                            existingHashtags.push(t[1]);
                    // } else {
                    //     existingHashtags[t[1]] = (existingHashtags[t[1]] ?? 0) + 1;
                    }
                }
            }

            console.log(existingHashtags);

            return existingHashtags;
        });
    };

    const processList = (event: NDKEvent) => {
        const list = NDKList.from(event);
        opts.listsStore!.update((lists) => {
            lists.set(list.tagId(), list);
            return lists;
        });
    };

    const updateFollows = (event: NDKEvent) => {
        const follows = event.tags
            .filter((t: NDKTag) => t[0] === 'p')
            .map((t: NDKTag) => t[1]);

        // if authors has more than one, add the current data, otherwise replace
        if (authors.length > 1) {
            opts.followsStore!.update((existingFollows) => {
                follows.forEach((f) => existingFollows.add(f));
                return existingFollows;
            });
        } else
            opts.followsStore!.set(new Set(follows));
    };

    return new Promise((resolve) => {
        const kinds = opts.extraKinds ?? [];

        if (opts.highlightStore) {
            kinds.push(9802 as number);      // highlight shelves
        }

        if (opts.followsStore)
            kinds.push(3);        // follows

        if (opts.listsStore) {
            kinds.push(...opts.listsKinds!);
        }

        const filters: NDKFilter[] = [
            { kinds, authors },
            { "#k": ["9802"], authors }
        ];

        if (opts.followHashtagsStore) {
            filters.push({
                authors,
                "#d": ["hashtags"]
            });
        }

        const userDataSubscription = $ndk.subscribe(
            filters,
            {
                closeOnEose: opts.closeOnEose!,
                groupable: false,
                cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
                subId: `session:${name}`
            }
        );

        userDataSubscription.on('event', processEvent);

        userDataSubscription.on('eose', () => {
            eosed = true;

            if (kind3Key) {
                const mostRecentKind3 = mostRecentEvents.get(kind3Key!);

                // Process the most recent kind 3
                if (mostRecentKind3!.id !== processedKind3Id) {
                    processedKind3Id = mostRecentKind3!.id;
                    updateFollows(mostRecentKind3!);
                }
            }

            if (opts.waitUntilEoseToResolve) {
                resolve();
            }
        });

        if (!opts.waitUntilEoseToResolve) {
            resolve();
        }
    });
}
