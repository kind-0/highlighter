<script lang="ts">
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import NavigationButton from './Button.svelte';
    import type NDKList from '$lib/ndk-kinds/lists';
    import { sortedLists} from '$lib/stores/list';
    export let item: NDKList;
    import { createDraggableEvent } from "$lib/utils/draggable";

    let hover = false;

    async function addToList(e: DragEvent) {
        if (!e.dataTransfer) return;

        const id = e.dataTransfer.getData('id');
        const kind = e.dataTransfer.getData('kind');
        let tag = e.dataTransfer.getData('tag');

        // refuse to add to self
        if (id === item.encode()) {
            return;
        }

        tag = JSON.parse(tag);


        // encrypted notes are added to encrypted tags
        if (kind === '4') {
            await item.addItem(tag, undefined, true);
        } else {
            if (item.tags.find((t) => t[1] === id)) {
                alert('already has it');
                return;
            }

            await item.addItem(tag);
        }

        item.created_at = Math.floor(Date.now() / 1000);
        await item.sign();
        item.publish();
    }

    function tagIsList(tag: NDKTag) {
        return tag[0] === 'a' && (tag[1].startsWith('30000:') || tag[1].startsWith('30001:') || tag[1].startsWith('30022:'));
    }

    function decendants(list: NDKList) {
        const decendants = [];

        for (const tag of item.tags) {
            if (tagIsList(tag)) {
                const list = $sortedLists.find((l) => l.tagId() === tag[1]);
                if (list) {
                    decendants.push(list);
                }
            }
        }

        return decendants;
    }

    $: children = decendants(item);

    const draggableHandler = createDraggableEvent(item);
</script>

<li>
    <div
        use:draggableHandler
        on:dragenter={() => (hover = true)}
        on:dragleave={() => (hover = false)}
        on:drop={(e) => {
            addToList(e);
            hover = false;
        }}
        ondragover="return false"
        class="
            {hover ? 'bg-orange-200' : ''}
        "
    >
        <NavigationButton
            route="/my/lists/{item.encode()}"
            class={hover ? 'bg-orange-200' : ''}
        >
            <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600"
                >{item.name.slice(0, 1)}</span
            >
            <span class="truncate">{item.name}</span>
        </NavigationButton>
    </div>

    {#if children.length > 0}
        <ul class="ml-4">
            {#each children as child}
                <svelte:self item={child} />
            {/each}
        </ul>
    {/if}
</li>
