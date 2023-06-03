import { writable } from 'svelte/store';
import NDK from '@nostr-dev-kit/ndk';
import DexieAdapter from '$lib/caches/dexie';

const dexieCacheAdaper = new DexieAdapter();

const ndk = writable(new NDK({
    explicitRelayUrls: [
        'wss://purplepag.es',
        // 'ws://localhost:8080',
        'wss://nos.lol',
        'wss://relay.f7z.io',
        'wss://relay.damus.io',
        'wss://relay.snort.social',
        'wss://nostr.mom',
        'wss://atlas.nostr.land/',
        'wss://offchain.pub/'
    ],
    // devWriteRelayUrls: [
    //     'ws://localhost:8080',
    // ],
    cacheAdapter: dexieCacheAdaper,
}));

export default ndk;

const _bunkerNDK = new NDK({
    explicitRelayUrls: [
        'wss://relay.nsecbunker.com',
        'wss://nostr.vulpem.com',
    ],
});

export const bunkerNDK = writable(_bunkerNDK);