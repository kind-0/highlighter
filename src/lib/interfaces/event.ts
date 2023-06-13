import { get as getStore } from 'svelte/store';
import ndk from '../stores/ndk';
import { NDKEvent } from '@nostr-dev-kit/ndk';

class NDKDexieEvent extends NDKEvent {
    constructor() {
        const _ndk = getStore(ndk);
        super(_ndk);
    }
}
