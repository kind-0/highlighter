<script lang="ts">
    import { page } from '$app/stores';
    import SidebarFolderLeaf from './SidebarFolderLeaf.svelte';
    import { sortedLists} from '$lib/stores/list';

    import type NDKList from '$lib/ndk-kinds/lists';
    import type { NDKTag } from '@nostr-dev-kit/ndk';

    export let item: NDKList;
    export let href: string;







    const tagIsList = (tag: NDKTag) => {
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

    $: active = $page?.url?.pathname === `/lists/${item.encode()}`
</script>

{#if children.length > 0}
    <li>
        <details open>
            <summary class:active={active}>
                <SidebarFolderLeaf {href} {item} />
            </summary>
            <ul>
                {#each children as child}
                    <svelte:self href={`/lists/${child.encode()}`} item={child} />
                {/each}
            </ul>
        </details>
    </li>
{:else}
    <!-- <div class:active={active} class="flex flex-row items-stretch w-full"> -->
    <SidebarFolderLeaf {href} {item} />
{/if}
