<script lang="ts">
    import type NDKList from '$lib/ndk-kinds/lists';
    import { debounce } from 'throttle-debounce';
    import SidebarFolderLeaf from './SidebarFolderLeaf.svelte';
    import type { Readable } from 'svelte/store';

    export let title: string;
    export let linkPrefix = '/highlights/a/';
    export let linkSuffix = '';
    export let list: Readable<NDKList[]>;

    let renderedList: NDKList[] | undefined = undefined;

    const updatedRenderedLists = debounce(300, () => {
        renderedList = $list;
    });

    $: if (renderedList?.length !== $list.length) {
        updatedRenderedLists();
    }

    function linkUrl(item: NDKList) {
        return `${linkPrefix}${item.encode()}${linkSuffix}`;
    }
</script>

{#if renderedList?.length > 0}
    <div class="flex flex-col flex-grow">
        <li class="menu-title">{title}</li>

        {#each renderedList ?? [] as item}
            <SidebarFolderLeaf href={linkUrl(item)} {item} />
        {/each}
    </div>
{/if}

<style>
    a {
        @apply duration-300 transition-all cursor-pointer;
    }

    a:hover {
        @apply text-white;
    }
</style>
