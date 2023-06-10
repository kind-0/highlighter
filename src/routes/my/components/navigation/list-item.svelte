<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { NDKEvent, type NDKTag } from '@nostr-dev-kit/ndk';

    import NavigationButton from './Button.svelte';
    import BookmarkListInterface from '$lib/interfaces/bookmark-list';
    import NDKList from '$lib/ndk-kinds/lists';

    export let allLists: App.BookmarkList[];
    export let list: App.BookmarkList;

    let loadedListId: string;
    let listEvent = new NDKList($ndk, JSON.parse(list.event));
    let childrenLists;

    let hover = false;

    async function addToList(e: DragEvent) {
        if (!e.dataTransfer) return;

        const id = e.dataTransfer.getData('id');
        const kind = e.dataTransfer.getData('kind');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        // encrypted notes are added to encrypted tags
        if (kind === '4') {
            await listEvent.addItem(tag, undefined, true);
        } else {
            if (listEvent.tags.find(t => t[1] === id)) {
                alert('already has it');
                return;
            }

            await listEvent.addItem(tag);
        }

        listEvent.created_at = Math.floor(Date.now() / 1000);
        await listEvent.sign();
        listEvent.publish();
    }

    function tagIsList(tag: NDKTag) {
        return tag[0] === 'a' && (
            tag[1].startsWith('30000:') ||
            tag[1].startsWith('30001:') ||
            tag[1].startsWith('30022:')
        );
    }

    $: {
        if (loadedListId !== list.id && list.id) {
            const ids = [];
            for (const tag of listEvent.tags) {
                if (tagIsList(tag)) {
                    ids.push(tag[1]);
                }
            }

            if (ids.length > 0) {
                childrenLists = BookmarkListInterface.load({decodedNaddrs: ids});
            }
        }
    }

    function decendants(list: App.BookmarkList) {
        const decendants = [];

        for (const tag of listEvent.tags) {
            if (tagIsList(tag)) {
                const list = allLists.find(l => l.id === tag[1]);
                if (list) {
                    decendants.push(list);
                }
            }
        }

        return decendants;
    }

    const children = decendants(list);

    function dragStart(event: DragEvent) {
        if (!event.dataTransfer) return;

        const e = new NDKEvent($ndk, JSON.parse(list.event));
        const tag = e.tagReference();

        event.dataTransfer.setData('id', list.id as string);
        event.dataTransfer.setData('tag', JSON.stringify(tag));
    }
</script>

<li>
    <div
        draggable={true}
        on:dragstart={dragStart}
        on:dragenter={() => hover = true}
        on:dragleave={() => hover = false}
        on:drop={e => {addToList(e); hover = false;}}
        ondragover="return false"
        class="
            {hover ? 'bg-gray-100' : ''}
        "
    >
        <NavigationButton route="/my/lists/{list.naddr}">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">{list.title.slice(0,1)}</span>
                <span class="truncate">{list.title}</span>
        </NavigationButton>
    </div>

    {#if children.length > 0}
        <ul class="ml-4">
            {#each children as child}
                <svelte:self list={child} {allLists} />
            {/each}
        </ul>
    {/if}

</li>
