import NDKList from '../ndk-kinds/lists';
import { NDKListKinds } from '../ndk-kinds/index.js';
import { NDKKind, type NDKEvent, type NDKUser, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { writable, derived, get as getStore } from 'svelte/store';
import ndk from './ndk';
import { throttle, debounce } from 'throttle-debounce';

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

export function getLists(user: NDKUser) {
    const $ndk = getStore(ndk);
    const sub = $ndk.subscribe(
        {
            kinds: [NDKKind.EventDeletion, ...(NDKListKinds as number[])],
            authors: [user.hexpubkey()],
        },
        {
            closeOnEose: false,
            groupable: false,
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        }
    );

    sub.on('event', (event: NDKEvent) => {
        if (!shouldProcess(event)) return;

        if (event.tagValue('d') === '3e57m2ngxkn2jlbv') {
            console.log(`list subscription received event`, event.created_at, event.tags.length, 'items')
        }

        if (event.kind === NDKKind.EventDeletion) {
            const tag = event.tagValue('a');
            if (tag) {
                deletions.update((deletions) => {
                    deletions.add(tag);
                    return deletions;
                });
            }
        } else {
            event.ndk = $ndk; // #ndk-bug? this should be already set when it's called from the subscription
            const list = NDKList.from(event);
            lists.update((lists) => {
                lists.set(list.tagId(), list);
                return lists;
            });
        }

        return;
    });

    return sub;
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
