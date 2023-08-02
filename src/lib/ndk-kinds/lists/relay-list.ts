import type { NDKEvent, NostrEvent } from '@nostr-dev-kit/ndk';
import NDKList from './index.js';
import type NDK from '@nostr-dev-kit/ndk';

class NDKRelayList extends NDKList {
    constructor(ndk?: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
    }

    static from(ndkEvent: NDKEvent) {
        return new NDKRelayList(ndkEvent.ndk, ndkEvent.rawEvent());
    }

    public validateTag(tagValue: string): boolean | string {
        if (tagValue.startsWith('wss://')) return true;
        if (tagValue.startsWith('nrelay')) return true;

        return 'Invalid relay URL';
    }

    /**
     * Get the list of relays
     */
    get relays(): string[] {
        console.log(this.getMatchingTags('r'));

        return this.getMatchingTags('r').map((tag) => tag[1]);
    }
}

export default NDKRelayList;
