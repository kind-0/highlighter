import NDKList from '../ndk-kinds/lists';
import { NDKListKinds } from '../ndk-kinds/index.js';
import { NDKKind, type NDKEvent, type NDKUser, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { writable, derived, get as getStore } from 'svelte/store';
import ndk from './ndk';
import { db } from '$lib/interfaces/db';

export const lists = writable<Map<string, NDKList>>(new Map());
export const deletions = writable<Set<string>>(new Set());
export const sortedLists = derived(lists, ($lists) => {
    if (!$lists) {
        return [];
    }

    // return alphabetically sorted lists
    return [...$lists.values()].sort((a, b) => {
        return a.name!.localeCompare(b.name!);
    });
});

const requestedDeletions = new Set<string>();

export function getLists(user: NDKUser) {
    const $ndk = getStore(ndk);
    const sub = $ndk.subscribe(
        {
            kinds: [...(NDKListKinds as number[])],
            authors: [user.hexpubkey()],
        },
        {
            closeOnEose: false,
            groupable: false,
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        }
    );

    sub.on('event', processEvent);

    return sub;
}

function shouldRequestDeletion(event: NDKEvent) {
    return !requestedDeletions.has(event.tagId());
}

/**
 * Called when a list event is received.
 *
 * - Adds the list to the store.
 * - Checks if the list has been deleted.
 */
export function processEvent(event: NDKEvent) {
    const $ndk = getStore(ndk);
    if (!shouldProcess(event)) return;

    event.ndk = $ndk; // #ndk-bug? this should be already set when it's called from the subscription
    const list = NDKList.from(event);
    lists.update((lists) => {
        lists.set(list.tagId(), list);
        return lists;
    });

    if (shouldRequestDeletion(event)) {
        requestedDeletions.add(event.tagId());

        // Request deletions specific to each list
        const deletionSub = $ndk.subscribe({
            kinds: [NDKKind.EventDeletion as number],
            ...event.filter(),
        }, {
            closeOnEose: true,
            groupableDelay: 1000
        });

        deletionSub.on('event', processDeletionEvent);
    }
}

/**
 * Called when a deletion event is received.
 *
 * - Removes the list from the store if the deletion event is newer than the list's creation event.
 * - Adds the list's tag to the deletions set.
 * - Deletes the list's event from the cache.
 */
function processDeletionEvent(event: NDKEvent) {
    const tag = event.tagValue('a');
    if (tag) {
        deletions.update((deletions) => {
            deletions.add(tag);
            return deletions;
        });
        lists.update((lists) => {
            // get the list from the store
            const list = lists.get(tag);
            if (!list) return lists;

            // remove the list from the store if the timestamp of the deletion is greater than the list's timestamp
            if (event.created_at! > list.created_at!) {
                lists.delete(tag);

                // delete from the cache the list's event
                db.events.delete(list.tagId());
            }

            return lists;
        });
    }
}

function shouldProcess(event: NDKEvent) {
    // filter out bad list names
    if (event.kind !== NDKKind.EventDeletion) {
        const name = NDKList.from(event).name!;

        if (!name || name.startsWith('chats/')) {
            return;
        }
    }

    return true;
}
