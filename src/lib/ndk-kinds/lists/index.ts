import NDK, { NDKEvent, NDKUser, type NDKTag, type NostrEvent, NDKRelay, type NDKSigner } from "@nostr-dev-kit/ndk";
import { NDKKind } from "../index.js";

/**
 * Represents any NIP-33 list kind.
 */
class NDKList extends NDKEvent {
    private _encryptedTags: NDKTag[] | undefined;

    constructor(ndk: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        if (!this.kind) this.kind = NDKKind.GenericList;
    }

    get name(): string | undefined {
        return this.tagValue('d');
    }

    set name(name: string | undefined) {
        if (name) {
            this.tags.push(['d', name]);
        } else {
            this.removeTag('d');
        }
    }

    get description(): string | undefined {
        return this.tagValue('description');
    }

    set description(name: string | undefined) {
        if (name) {
            this.tags.push(['description', name]);
        } else {
            this.removeTag('description');
        }
    }

    /**
     * Returns the decrypted content of the list.
     */
    async encryptedTags(): Promise<NDKTag[]> {
        if (this._encryptedTags) return this._encryptedTags;

        if (!this.ndk) throw new Error('NDK instance not set');
        if (!this.ndk.signer) throw new Error('NDK signer not set');

        const user = await this.ndk.signer.user();

        try {
            if (this.content.length > 0) {
                await this.decrypt(user);

                const a = JSON.parse(this.content);
                if (a && a[0]) {
                    return a;
                }
            }
        } catch (e) {
            // console.trace(e);
            // throw e;
        }

        return [];
    }

    public validateTag(tagValue: string): boolean | string {
        return true;
    }

    public items(): NDKTag[] {
        return this.tags.filter((t) => {
            return ![
                'd',
                'description',
            ].includes(t[0]);
        });
    }

    async addItem(relay: NDKRelay, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(event: NDKEvent, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(user: NDKUser, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(tag: NDKTag, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(
        obj: NDKUser | NDKEvent | NDKRelay | NDKTag,
        mark: string | undefined = undefined,
        encrypted: boolean = false
    ): Promise<void> {
        if (!this.ndk) throw new Error('NDK instance not set');
        if (!this.ndk.signer) throw new Error('NDK signer not set');

        let tag;

        if (obj instanceof NDKEvent) {
            tag = obj.tagReference();
        } else if (obj instanceof NDKUser) {
            tag = obj.tagReference();
        } else if (obj instanceof NDKRelay) {
            tag = ['r', (obj as NDKRelay).url];
        } else if (Array.isArray(obj)) { // NDKTag
            tag = obj;
        } else {
            throw new Error('Invalid object type');
        }

        if (mark) tag.push(mark);

        if (encrypted) {
            const user = await this.ndk.signer.user();
            const currentList = await this.encryptedTags();
            currentList.push(tag);
            this._encryptedTags = currentList;
            this.content = JSON.stringify(currentList);
            await this.encrypt(user);
        } else {
            this.tags.push(tag);
        }

        this.created_at = Math.floor(Date.now() / 1000);
    }
}

export default NDKList;