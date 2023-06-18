import NDKList from '../ndk-kinds/lists';
import { NDKListKinds } from '../ndk-kinds/index.js';
import { NDKKind, type NDKEvent, type NDKUser, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { writable, derived, get as getStore } from 'svelte/store';
import ndk from './ndk';

export const lists = writable<Map<string, NDKList>>(new Map());
export const deletions = writable<Set<string>>(new Set());
export const sortedLists = derived(lists, ($lists) => {
    if (!$lists) {
        return [];
    }

    // return alphabetically sorted lists
    return [...$lists.values()].sort((a, b) => {
        return a.name!.localeCompare(b.name!);
    });
});

export function getLists(user: NDKUser) {
    const $ndk = getStore(ndk);
    const sub = $ndk.subscribe(
        {
            kinds: [...(NDKListKinds as number[])],
            authors: [user.hexpubkey()],
        },
        {
            closeOnEose: false,
            groupable: false,
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        }
    );

    sub.on('event', (event: NDKEvent) => {
        if (!shouldProcess(event)) return;

        event.ndk = $ndk; // #ndk-bug? this should be already set when it's called from the subscription
        const list = NDKList.from(event);
        lists.update((lists) => {
            lists.set(list.tagId(), list);
            return lists;
        });

        // Request deletions specific to each list
        const deletionSub = $ndk.subscribe({
            kinds: [NDKKind.EventDeletion as number],
            ...event.filter(),
        }, {
            closeOnEose: true,
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
        });

        deletionSub.on('event', (event: NDKEvent) => {
            const tag = event.tagValue('a');
            if (tag) {
                deletions.update((deletions) => {
                    deletions.add(tag);
                    return deletions;
                });
                lists.update((lists) => {
                    // get the list from the store
                    const list = lists.get(tag);
                    if (!list) return lists;

                    // remove the list from the store if the timestamp of the deletion is greater than the list's timestamp
                    if (event.created_at! > list.created_at!) {
                        lists.delete(tag);
                    }

                    return lists;
                });
            }
        });
    });

    return sub;
}

function shouldProcess(event: NDKEvent) {
    // filter out bad list names
    if (event.kind !== NDKKind.EventDeletion) {
        const name = NDKList.from(event).name!;

        if (!name || name.startsWith('chats/')) {
            return;
        }
    }

    return true;
}
