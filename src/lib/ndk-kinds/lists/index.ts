import NDK, { NDKEvent, NDKUser, type NDKTag, type NostrEvent, NDKRelay, type NDKSigner, type NDKFilter, mergeFilters } from '@nostr-dev-kit/ndk';
import { NDKKind } from '../index.js';
import { filterForId } from '$lib/utils/index.js';

/**
 * Represents any NIP-33 list kind.
 */
class NDKList extends NDKEvent {
    public _encryptedTags: NDKTag[] | undefined;

    /**
     * Stores the number of bytes the content was before decryption
     * to expire the cache when the content changes.
     */
    private encryptedTagsLength: number | undefined;

    constructor(ndk?: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        if (!this.kind) this.kind = NDKKind.GenericList;
    }

    static from(ndkEvent: NDKEvent): NDKList {
        return new NDKList(ndkEvent.ndk, ndkEvent.rawEvent());
    }

    get name(): string | undefined {
        return this.tagValue('name') ?? this.tagValue('d');
    }

    set name(name: string | undefined) {
        this.removeTag('name');

        if (name) {
            this.tags.push(['name', name]);
        } else {
            throw new Error('Name cannot be empty');
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
    async encryptedTags(useCache = true): Promise<NDKTag[]> {
        if (this._encryptedTags && this.encryptedTagsLength === this.content.length && useCache) return this._encryptedTags;

        if (!this.ndk) throw new Error('NDK instance not set');
        if (!this.ndk.signer) throw new Error('NDK signer not set');

        const user = await this.ndk.signer.user();

        try {
            if (this.content.length > 0) {
                try {
                    console.log(`decrypting ${this.content}`);
                    const decryptedContent = await this.ndk.signer.decrypt(user, this.content);
                    const a = JSON.parse(decryptedContent);
                    if (a && a[0]) {
                        this.encryptedTagsLength = this.content.length;
                        return this._encryptedTags = a;
                    }
                    this.encryptedTagsLength = this.content.length;
                    return this._encryptedTags = [];
                } catch (e) {
                    console.log(`error decrypting ${this.content}`);
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

    get items(): NDKTag[] {
        return this.tags.filter((t) => {
            return !['d', 'name', 'description'].includes(t[0]);
        });
    }

    async fetchItems(): Promise<Set<NDKEvent>> {
        let filters: NDKFilter[] = []

        if (!this.ndk) throw new Error('NDK instance not set');

        filters = this.items.map(i => filterForId(i[1]));

        console.log(`filters: ${JSON.stringify(filters)}`);
        console.log(mergeFilters(filters));

        return this.ndk.fetchEvents(
            mergeFilters(filters)
        );
    }

    async addItem(relay: NDKRelay, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(event: NDKEvent, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(user: NDKUser, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(tag: NDKTag, mark?: string, encrypted?: boolean): Promise<void>;
    async addItem(obj: NDKUser | NDKEvent | NDKRelay | NDKTag, mark: string | undefined = undefined, encrypted: boolean = false): Promise<void> {
        if (!this.ndk) throw new Error('NDK instance not set');
        if (!this.ndk.signer) throw new Error('NDK signer not set');

        let tag;

        if (obj instanceof NDKEvent) {
            tag = obj.tagReference();
        } else if (obj instanceof NDKUser) {
            tag = obj.tagReference();
        } else if (obj instanceof NDKRelay) {
            tag = ['r', (obj as NDKRelay).url];
        } else if (Array.isArray(obj)) {
            // NDKTag
            tag = obj;
        } else {
            throw new Error('Invalid object type');
        }

        if (mark) tag.push(mark);

        if (encrypted) {
            const user = await this.ndk.signer.user();
            const currentList = await this.encryptedTags();

            console.log(`current list: ${JSON.stringify(currentList)}`)

            currentList.push(tag);
            this._encryptedTags = currentList;
            this.encryptedTagsLength = this.content.length;
            this.content = JSON.stringify(currentList);
            await this.encrypt(user);
        } else {
            this.tags.push(tag);
        }

        this.created_at = Math.floor(Date.now() / 1000);
    }

    /**
     * Removes an item from the list.
     *
     * @param index The index of the item to remove.
     * @param encrypted Whether to remove from the encrypted list or not.
     */
    async removeItem(index: number, encrypted: boolean): Promise<NDKList> {
        if (!this.ndk) throw new Error('NDK instance not set');
        if (!this.ndk.signer) throw new Error('NDK signer not set');

        if (encrypted) {
            const user = await this.ndk.signer.user();
            const currentList = await this.encryptedTags();

            currentList.splice(index, 1);
            this._encryptedTags = currentList;
            this.encryptedTagsLength = this.content.length;
            this.content = JSON.stringify(currentList);
            await this.encrypt(user);
        } else {
            this.tags.splice(index, 1);
        }

        this.created_at = Math.floor(Date.now() / 1000);

        return this;
    }
}

export default NDKList;
