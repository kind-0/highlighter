<script lang="ts">
    import { Skeleton } from 'flowbite-svelte';

    import SidebarFolderBranch from '$lib/components/Sidebar/SidebarFolderBranch.svelte';
    import type NDKList from '$lib/ndk-kinds/lists';

    import { sortedLists } from '$lib/stores/list';

    import { debounce } from 'throttle-debounce';

    /**
     * Only display lists of these kinds
     */
    export let kinds: number[] | undefined = undefined;

    let renderedList: NDKList[] | undefined = undefined;

    const updatedRenderedLists = debounce(300, () => {
        renderedList = $sortedLists.filter(shouldDisplay);
    });

    $: if (renderedList?.length !== $sortedLists.length) {
        updatedRenderedLists();
    }

    function shouldDisplay(list: NDKList) {
        const hasRightKind = kinds ? kinds.includes(list.kind!) : true;
        return hasRightKind && isTopLevel(list);
    }

    function isTopLevel(thisList: NDKList) {
        for (const _list of $sortedLists) {
            const referenced = _list.tags.find((t) => t[1] === thisList.tagId());
            const notReferencedByItself = _list.tags.find((t) => t[1] !== _list.tagId()); // that is not itself
            if (referenced && notReferencedByItself) {
                return false;
            }
        }
        return true;
    }
</script>

{#if renderedList}

    {#if renderedList.length > 0}
        <slot name="title" />
    {/if}

    {#each renderedList as item}
        <SidebarFolderBranch
            href={`/lists/${item.encode()}`}
            {item}
        />
    {/each}
{:else}
    <Skeleton size="sm" class="my-8" />
{/if}
<!--
<style>

.list-container {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 200px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style> -->