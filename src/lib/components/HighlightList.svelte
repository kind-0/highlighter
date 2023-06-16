<script lang="ts">
    import HighlightListItem from "./HighlightListItem.svelte";
    import type NDKHighlight from "$lib/ndk-kinds/highlight";

    export let items: NDKHighlight[] = [];
    export let expandedContext: boolean = true;

    export let skipTitle: boolean = false;
</script>

<p><code>HighlightList</code></p>
<div class="grid grid-cols-1 gap-8 pb-32">
    {#each items as item}
        <HighlightListItem
            {expandedContext}
            highlight={item}
            {skipTitle}
            disableClick={true}
        />
    {/each}
</div>