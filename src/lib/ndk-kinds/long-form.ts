import NDK, { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
import { NDKKind } from './index.js';

class NDKLongForm extends NDKEvent {
    constructor(ndk: NDK | undefined, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind = NDKKind.LongForm;
    }

    get title(): string | undefined {
        return this.tagValue('title');
    }

    set title(title: string | undefined) {
        if (title) {
            this.tags.push(['title', title]);
        } else {
            this.removeTag('title');
        }
    }

    get url(): string | undefined {
        return this.tagValue('url');
    }

    set url(url: string | undefined) {
        if (url) {
            this.tags.push(['url', url]);
        } else {
            this.removeTag('url');
        }
    }
}

export default NDKLongForm;
