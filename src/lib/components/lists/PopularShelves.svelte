<!--
    This component shows lists of popular lists
-->
<script lang="ts">
    import MenuItem from "../sidebars/MenuItem.svelte";
    import NDKList from "$lib/ndk-kinds/lists";
    import ndk from "$lib/stores/ndk";
    import { Name } from "@nostr-dev-kit/ndk-svelte-components";
    import { NDKKind } from "$lib/ndk-kinds";

    const lists = $ndk.storeSubscribe({
        kinds: [NDKKind.HighlightList as number],
    }, undefined, NDKList);
</script>

{#if $lists?.length > 1}
    <ul class="menu bg-base-200 w-full rounded-box">
        <li class="menu-title">POPULAR LISTS</li>

        {#each $lists as item}
            <MenuItem href={`/highlights/a/${item.encode()}`}>
                <Name ndk={$ndk} user={item.author} />'s
                {item.name}
            </MenuItem>
        {/each}
    </ul>
{/if}