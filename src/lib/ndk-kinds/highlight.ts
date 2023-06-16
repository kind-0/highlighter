import NDK, { NDKEvent, type NDKTag, type NostrEvent } from '@nostr-dev-kit/ndk';
import { NDKKind } from './index.js';
import { nip19 } from 'nostr-tools';
import NDKLongForm from './long-form.js';

/**
 * Highlight as defined by NIP-84 (kind:9802).
 */
class NDKHighlight extends NDKEvent {
    private _article: NDKEvent | string | undefined;

    constructor(ndk?: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind = NDKKind.Highlight;
    }

    static from(event: NDKEvent) {
        return new NDKHighlight(event.ndk, event.rawEvent());
    }

    get url(): string | undefined {
        return this.tagValue('r');
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

    getArticleTag(): NDKTag | undefined {
        return this.getMatchingTags('a')[0] || this.getMatchingTags('e')[0] || this.getMatchingTags('r')[0];
    }

    async getArticle(): Promise<NDKLongForm | NDKEvent | string | undefined> {
        if (this._article !== undefined) return this._article;

        // check for 'a' tag
        let taggedBech32: string | undefined;
        const articleTag = this.getArticleTag();

        if (!articleTag) return undefined;

        switch (articleTag[0]) {
            case 'a':
                const [kind, pubkey, identifier] = articleTag[1].split(':');
                taggedBech32 = nip19.naddrEncode({ kind: parseInt(kind), pubkey, identifier });
                break;
            case 'e':
                taggedBech32 = nip19.noteEncode(articleTag[1]);
                break;
            case 'r':
                this._article = articleTag[1];
                break;
        }

        if (taggedBech32) {
            let a = await this.ndk?.fetchEvent(taggedBech32);
            if (a) {
                if (a.kind === NDKKind.LongForm) {
                    a = new NDKLongForm(this.ndk, a.rawEvent());
                }

                this._article = a;
            }
        }

        return this._article;
    }
}

export default NDKHighlight;
