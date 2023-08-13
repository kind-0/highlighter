<!--
    This component shows lists that include the some of the same items included in this list
-->
<script lang="ts">
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import MenuItem from "../sidebars/MenuItem.svelte";
    import NDKList from "$lib/ndk-kinds/lists";
    import ndk from "$lib/stores/ndk";
    import { Name } from "@nostr-dev-kit/ndk-svelte-components";

    export let list: NDKList;
    export let items: NDKTag[];

    const eTagValues = items.filter(t => t[0] === 'e').map(t => t[1]);

    const lists = $ndk.storeSubscribe({
        kinds: [list.kind as number],
        "#e": eTagValues,
    }, undefined, NDKList);
</script>

{#if $lists?.length > 1}
    <ul class="menu bg-base-200 w-full rounded-box">
        <li class="menu-title">SIMILAR LISTS</li>

        {#each $lists as item}
            {#if list.id !== item.id}
                <MenuItem href={`/p/${item.author.npub}/lists/${item.encode()}`}>
                    <Name ndk={$ndk} user={item.author} />'s
                    {item.name}
                </MenuItem>
            {/if}
        {/each}
    </ul>
{/if}