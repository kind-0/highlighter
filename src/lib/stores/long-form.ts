import { writable, derived, get as getStore } from 'svelte/store';
import ndk from './ndk';
import NDK, { NDKSubscriptionCacheUsage, type NDKSubscription, type NDKUser, NDKEvent, NDKArticle } from '@nostr-dev-kit/ndk';
import {NDKKind} from '../ndk-kinds/index.js';
import debug from 'debug';

const d = debug('highlighter:long-form');

type DirtiableLongForm = NDKArticle & { dirty?: boolean };

type LongFormEvents = Map<string, DirtiableLongForm>;

/**
 * This store contains all UNENCRYPTED long form events.
 */
export const longFormStore = writable<LongFormEvents>(new Map());

/**
 * This store contains all UNENCRYPTED long form events that have not been saved.
 */
export const unsavedLongFormStore = derived(longFormStore, ($longFormStore) => {
    if (!$longFormStore) {
        return [];
    }

    return [...$longFormStore.values()].filter((longForm) => {
        return !isSaved(longForm);
    });
});

/**
 * Adds a new long form to the store.
 */
export function addLongForm(longForm: NDKArticle, dirty = false): void {
    console.log(`add`)
    d(`calling addLongForm with dirty=${dirty}`)
    // Update the store by adding the new form under the generated key
    longFormStore.update(storeState => {
        const entry: DirtiableLongForm = longForm as DirtiableLongForm;
        entry.dirty = dirty;
        d(`Adding long form ${longForm.title} to store ${dirty ? 'as dirty' : ''}`)
        storeState.set(longForm.encode(), entry);
        return storeState;
    });
}

/**
 * Removes a long form from the store.
 */
export function removeLongForm(longForm: NDKArticle): void {
    longFormStore.update(storeState => {
        storeState.delete(longForm.encode());
        return storeState;
    });
}

/**
 * Creates a subscription to retrieve all long forms for a given user.
 */
export function getLongForms(user: NDKUser): NDKSubscription {
    const $ndk = getStore(ndk);
    const sub = $ndk.subscribe({
        kinds: [NDKKind.LongForm, 31023 as number],
        authors: [user.hexpubkey()],
    }, {
        closeOnEose: false,
        groupable: false,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    });

    sub.on('event', (event: NDKEvent) => {
        event.ndk = $ndk;
        const longForm = NDKArticle.from(event);

        if (isEncrypted(longForm)) {
            decryptLongForm(longForm, $ndk).then((decryptedLongForm) => {
                d(`Adding decrypted long form ${decryptedLongForm.title} to store`);
                addLongForm(longForm);
            });
        } else {
            d(`Adding long form ${longForm.title} to store`);
            addLongForm(longForm);
        }
    });

    return sub;
}

/**
 * Decrypts a long form and returns the decrypted version.
 */
async function decryptLongForm(longForm: NDKArticle, ndk: NDK): Promise<NDKArticle> {
    const encryptedTitle = longForm.title;
    const author = longForm.author;

    if (encryptedTitle) {
        d(`Decrypting long form title from ${encryptedTitle}`);
        const decryptTitle = await ndk.signer!.decrypt(author, encryptedTitle);
        longForm.title = decryptTitle;
        d(`Decrypted long form title to ${decryptTitle}`);
    }

    await longForm.decrypt(author);
    return longForm;
}

export function isSaved(longForm: DirtiableLongForm): boolean {
    return !longForm.dirty && !!longForm.id;
}

function isEncrypted(longForm: NDKArticle): boolean {
    return longForm.kind === 31023;
}