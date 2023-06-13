import type { NostrEvent } from '@nostr-dev-kit/ndk';
import NDKList from './index.js';
import type NDK from '@nostr-dev-kit/ndk';

class NDKRelayList extends NDKList {
    constructor(ndk: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
    }

    public validateTag(tagValue: string): boolean | string {
        if (tagValue.startsWith('wss://')) return true;
        if (tagValue.startsWith('nrelay')) return true;

        return 'Invalid relay URL';
    }
}

export default NDKRelayList;
