import { writable, type Unsubscriber, type Writable } from 'svelte/store';
import NDK, { NDKEvent, type NDKFilter, type NDKSubscriptionOptions } from '@nostr-dev-kit/ndk';
import type { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import DexieAdapter from '$lib/caches/dexie';
// import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';
import { browser } from '$app/environment';
import NDKRepost from '$lib/ndk-kinds/NDKRepost';

let cacheAdapter: NDKCacheAdapter | undefined;

if (browser) {
    cacheAdapter = new DexieAdapter();
} else {
    // cacheAdapter = new NDKRedisCacheAdapter();
    // console.log(`Using cache NDKRedisCacheAdapter`);
}

// get relays from localstorage
let relays;

try {
    relays = localStorage.getItem('relays');
} catch (e) { /* empty */ }

let relayList: string[] = [];

if (relays) {
    relayList = JSON.parse(relays);
}

export const defaultRelays = [
    // 'wss://pablof7z.nostr1.com',
    'wss://purplepag.es',
    // 'ws://localhost:8080',

    'wss://nos.lol',
    // 'wss://relay.f7z.io',
    'wss://relay.damus.io',
    'wss://relay.snort.social',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr-pub.wellorder.net'
];

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
    relayList = defaultRelays;
}

type UnsubscribableStore<T> = Writable<T> & {
    unsubscribe: Unsubscriber;
    onEose: (cb: () => void) => void;
};

export type NDKEventStore<T> = UnsubscribableStore<T[]>;

export type NDKSvelte = NDK & {
    storeSubscribe: <T>(filters: NDKFilter|NDKFilter[], opts?: NDKSubscriptionOptions, klass?: classWithConvertFunction<any>) => NDKEventStore<T>;
    storeSubscribeWithReposts: <T>(filters: NDKFilter|NDKFilter[], repostsFilter: NDKFilter, opts?: NDKSubscriptionOptions, klass?: classWithConvertFunction<T>) => NDKEventStore<T>;
};

const _ndk: NDKSvelte = new NDK({
    explicitRelayUrls: relayList,
    cacheAdapter,
}) as NDKSvelte;

type classWithConvertFunction<T> = {
    from: (event: NDKEvent) => T;
};

_ndk.storeSubscribeWithReposts = <T>(
    filters: NDKFilter|NDKFilter[],
    repostsFilter: NDKFilter,
    opts?: NDKSubscriptionOptions,
    klass?: classWithConvertFunction<T>
): NDKEventStore<T> => {
    const sub = _ndk.subscribe(filters, opts);
    const repostsSub = _ndk.subscribe(repostsFilter, opts);
    const eventIds: Set<string> = new Set();
    const events: T[] = [];
    const store: UnsubscribableStore<T[]> = {
        ...writable([]),
        unsubscribe: () => {
            sub.stop();
            repostsSub.stop();
        },
        onEose: (cb) => {
            sub.on('eose', cb);
        },
    };

    const addEvent = (event: NDKEvent) => {
        let e = event;
        if (klass) {
            e = klass.from(event);
        }
        e.ndk = _ndk;

        const id = event.tagId();
        if (eventIds.has(id)) return;
        eventIds.add(id);
        events.push(e as unknown as T);
        store.set(events);
    };

    repostsSub.on('event', (repostEvent: NDKEvent) => {
        const _repostEvent = NDKRepost.from(repostEvent);
        _repostEvent.ndk = _ndk;

        _repostEvent.repostedEvents(klass).then((events: T[]) => {
            for (const e of events) {
                console.log(`1going to add event ${e.id} which was reposted by event ${repostEvent.id}`);
                addEvent(e);
                console.log(`after running eventIds has ${eventIds.size} items`);
            }
        });
    });

    sub.on('event', addEvent);

    return store;
};

_ndk.storeSubscribe = <T>(filters: NDKFilter|NDKFilter[], opts?: NDKSubscriptionOptions, klass?: classWithConvertFunction<T>): NDKEventStore<T> => {
    const sub = _ndk.subscribe(filters, opts);
    const eventIds: Set<string> = new Set();
    const events: T[] = [];
    const store: UnsubscribableStore<T[]> = {
        ...writable([]),
        unsubscribe: () => {
            sub.stop();
        },
        onEose: (cb) => {
            sub.on('eose', cb);
        },
    };

    sub.on('event', addEvent(
        eventIds,
        events,
        store,
        klass
    ));

    return store;
};

function addEvent<T>(
    eventIds: Set<string>,
    events: T[],
    store: UnsubscribableStore<T[]>,
    klass?: classWithConvertFunction<T>
) {
    return (event: NDKEvent) => {
        let e = event;
        if (klass) {
            e = klass.from(event);
        }
        e.ndk = _ndk;

        const id = event.tagId();
        if (eventIds.has(id)) return;
        eventIds.add(id);
        events.push(e as unknown as T);
        store.set(events);
    };
}

const ndk = writable(_ndk);

export default ndk;

const _bunkerNDK = new NDK({
    explicitRelayUrls: ['wss://relay.nsecbunker.com', 'wss://nostr.vulpem.com'],
});

export const bunkerNDK = writable(_bunkerNDK);
