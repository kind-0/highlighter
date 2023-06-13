import NDKList from '../ndk-kinds/lists';
import { NDKListKinds } from '../ndk-kinds/index.js';
import { NDKKind, type NDKEvent, type NDKUser } from '@nostr-dev-kit/ndk';
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
        { closeOnEose: true, groupable: false }
    );

    let eosed = true;
    const preEoseLists: Map<string, NDKList> = new Map();
    const preEoseDeletions: Set<string> = new Set();

    const updateList = throttle(250, () => {
        // remove all lists that have been deleted
        preEoseLists.forEach((list, id) => {
            if (preEoseDeletions.has(id)) {
                preEoseLists.delete(id);
            }
        });

        lists.set(preEoseLists);
        deletions.set(preEoseDeletions);
    });

    sub.on('event', (event: NDKEvent) => {
        if (!shouldProcess(event)) return;

        // if (!eosed) {
        if (event.kind === NDKKind.EventDeletion) {
            const tag = event.tagValue('a');
            if (tag) {
                preEoseDeletions.add(tag);
            }
        } else {
            event.ndk = $ndk;
            const list = NDKList.from(event);
            preEoseLists.set(list.tagId(), list);
        }

        updateList();

        return;
        // }

        // if (event.kind === NDKKind.EventDeletion) {
        //     deletions.update((deletions) => {
        //         deletions.add(event.tagValue('a')!);

        //         // remove the list from the lists store
        //         if (getStore(lists).has(event.id)) {
        //             lists.update((lists) => {
        //                 lists.delete(event.id);
        //                 return lists;
        //             });
        //         }

        //         return deletions;
        //     });
        // } else {
        //     const $deletion = getStore(deletions);

        //     lists.update((lists) => {
        //         event.ndk = $ndk;
        //         const list = NDKList.from(event);

        //         // if it hasn't been marked as deleted
        //         if ($deletion.has(list.encode())) {
        //             return lists;
        //         } else {
        //             // ad it to the list
        //             lists.set(list.encode(), list);
        //         }

        //         return lists;
        //     });
        // }
    });

    sub.on('eose', () => {
        eosed = true;

        console.log(`eosed`);

        // add the pre-eose lists
        lists.set(preEoseLists);
        deletions.set(preEoseDeletions);
    });
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
