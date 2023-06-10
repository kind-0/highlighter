import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';
import type { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import DexieAdapter from '$lib/caches/dexie';
// import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';
import { browser } from '$app/environment';

let cacheAdapter: NDKCacheAdapter;

if (browser) {
    cacheAdapter = new DexieAdapter();
    console.log(`Using cache DexieAdapter`);
} else {
    // cacheAdapter = new NDKRedisCacheAdapter();
    // console.log(`Using cache NDKRedisCacheAdapter`);
}

// get relays from localstorage
let relays;

try {
    relays = localStorage.getItem('relays');
} catch (e) {
}

let relayList: string[] = [];

if (relays) {
    relayList = JSON.parse(relays);
}

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
    relayList = [
        'wss://purplepag.es',
        // 'ws://localhost:8080',
        'wss://nos.lol',
        'wss://relay.f7z.io',
        'wss://relay.damus.io',
        'wss://relay.snort.social',
        'wss://nostr.mom',
        // 'wss://atlas.nostr.land/',
        'wss://offchain.pub/'
    ];
}

const ndk = writable(new NDK({
    explicitRelayUrls: relayList,
    // devWriteRelayUrls: [
    //     'ws://localhost:8080',
    // ],
    cacheAdapter
}));

export default ndk;

const _bunkerNDK = new NDK({
    explicitRelayUrls: [
        'wss://relay.nsecbunker.com',
        'wss://nostr.vulpem.com',
    ],
});

export const bunkerNDK = writable(_bunkerNDK);