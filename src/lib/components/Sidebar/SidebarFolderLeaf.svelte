<script lang="ts">
    import { page } from '$app/stores';
    import type NDKList from '$lib/ndk-kinds/lists';
    import { Graph, UserCircle } from 'phosphor-svelte';
    import Highlight from '$lib/icons/Highlight.svelte';
    import MenuItem from "../sidebars/MenuItem.svelte";
    import { createDraggableEvent } from "$lib/utils/draggable";

    export let item: NDKList;
    export let href: string;

    let hover: boolean = false;
    let active: boolean;

    $: active = $page?.url?.pathname === `/lists/${item.encode()}`;

    const draggableHandler = createDraggableEvent(item);

    async function addToList(e: DragEvent) {
        if (!e.dataTransfer) return;

        const id = e.dataTransfer.getData('id');
        const kind = e.dataTransfer.getData('kind');
        const tag = e.dataTransfer.getData('tag');

        // refuse to add to self
        if (id === item.encode()) {
            return;
        }

        const newTag = JSON.parse(tag);

        // encrypted notes are added to encrypted tags
        if (kind === '4') {
            await item.addItem(newTag, undefined, true);
        } else {
            if (item.tags.find((t) => t[1] === id)) {
                alert('already has it');
                return;
            }

            await item.addItem(newTag);
        }

        item.created_at = Math.floor(Date.now() / 1000);
        await item.sign();
        item.publish();
    }
</script>

<MenuItem
    active={(hover && !active)}
    class="w-full"
    innerClass="flex flex-row items-center justify-between flex-grow"
    {href}
>
    <div
        class="flex flex-row items-center gap-2 w-full"
        use:draggableHandler
        on:dragenter={() => (hover = true)}
        on:dragleave={() => (hover = false)}
        on:drop={(e) => {
            addToList(e);
            hover = false;
        }}
        ondragover="return false"
    >
        <span class="truncate" class:text-base-100-content={active}>{item.name}</span>
    </div>

    <div class="badge badge-neutral badge-sm">
        {item.items.length}
    </div>
</MenuItem>

