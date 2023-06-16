import { writable, type Unsubscriber, type Writable } from 'svelte/store';
import NDK, { NDKEvent, type NDKFilter, type NDKFilterOptions, type NDKSubscriptionOptions } from '@nostr-dev-kit/ndk';
import type { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import DexieAdapter from '$lib/caches/dexie';
// import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';
import { browser } from '$app/environment';

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
} catch (e) {}

let relayList: string[] = [];

if (relays) {
    relayList = JSON.parse(relays);
}

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
    relayList = [
        // 'wss://purplepag.es',
        // 'ws://localhost:8080',
        'wss://nos.lol',
        'wss://relay.f7z.io',
        'wss://relay.damus.io',
        'wss://relay.snort.social',
        'wss://nostr.mom',
        // 'wss://atlas.nostr.land/',
        'wss://offchain.pub/',
    ];
}

type UnsubscribableStore<T> = Writable<T> & {
    unsubscribe: Unsubscriber;
    onEose: (cb: () => void) => void;
};

export type NDKEventStore<T> = UnsubscribableStore<T[]>;

export type NDKSvelte = NDK & {
    storeSubscribe: <T>(filter: NDKFilter, opts?: NDKSubscriptionOptions, klass?: classWithConvertFunction) => NDKEventStore<T>;
};

const _ndk: NDKSvelte = new NDK({
    explicitRelayUrls: relayList,
    cacheAdapter,
}) as NDKSvelte;

type classWithConvertFunction = {
    from: (event: NDKEvent) => any;
};

_ndk.storeSubscribe = <T>(filter: NDKFilter, opts?: NDKSubscriptionOptions, klass?: classWithConvertFunction): NDKEventStore<T> => {
    if (filter && filter['#q']) console.log(`opts for sub`, opts);
    const sub = _ndk.subscribe(filter, opts);
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

    sub.on('event', (event: NDKEvent) => {
        let e = event;
        if (klass) {
            e = klass.from(event);
        }
        e.ndk = _ndk;

        const id = event.encode();
        if (eventIds.has(id)) return;
        eventIds.add(id);
        events.push(e as unknown as T);
        store.set(events);
    });

    return store;
};

const ndk = writable(_ndk);

export default ndk;

const _bunkerNDK = new NDK({
    explicitRelayUrls: ['wss://relay.nsecbunker.com', 'wss://nostr.vulpem.com'],
});

export const bunkerNDK = writable(_bunkerNDK);
