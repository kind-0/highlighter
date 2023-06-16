<script lang="ts">
    import HighlightListItem from "./HighlightListItem.svelte";
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import { setContext } from "svelte";

    export let items: NDKHighlight[] = [];
    export let expandedContext: boolean = true;

    export let skipTitle: boolean = false;

    setContext("skipTitle", skipTitle);
</script>

<div class="flex flex-col gap-8">
    {#each items as item (item.id)}
        <HighlightListItem
            {expandedContext}
            highlight={item}
            {skipTitle}
            disableClick={true}
        />
    {/each}
</div>