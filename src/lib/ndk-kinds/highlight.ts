import NDK, { NDKEvent, type NostrEvent } from "@nostr-dev-kit/ndk";
import { NDKKind } from "./index.js";

/**
 * Highlight as defined by NIP-84 (kind:9802).
 */
class NDKHighlight extends NDKEvent {
    constructor(ndk: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind = NDKKind.Highlight;
    }

    /**
     * Context tag.
     */
    set context(context: string | undefined) {
        if (context === undefined) {
            this.tags = this.tags.filter(([tag, value]) => tag !== 'context');
        } else {
            this.tags.push(['context', context]);
        }
    }

    get context(): string | undefined {
        return this.tags.find(([tag, value]) => tag === 'context')?.[1] ?? undefined;
    }

    /**
     * Article the highlight is coming from.
     *
     * @param article Article URL or NDKEvent.
     */
    set article(article: NDKEvent | string) {
        if (typeof article === 'string') {
            this.tags.push(['r', article]);
        } else {
            this.tag(article);
        }
    }
}

export default NDKHighlight;