<script lang="ts">
    import ndk, { type NDKEventStore } from "$lib/stores/ndk";

    import HighlightCard from '$lib/components/highlights/HighlightCard.svelte';
    import { onDestroy, onMount } from 'svelte';
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import { currentUser } from "$lib/store";

    let highlights: NDKEventStore<NDKHighlight>;

    onMount(async () => {
        if (!$currentUser) return;

        highlights = $ndk.storeSubscribe({
            kinds: [9802 as number],
            authors: [$currentUser.hexpubkey()]
        }, { closeOnEose: false });
    })

    onDestroy(() => {
        if (highlights) highlights.unsubscribe();
    });
</script>

{#if $highlights}
    <div class="grid grid-flow-row md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {#each $highlights as highlight}
            {#await highlight.getArticle() then article}
                <HighlightCard
                    class="max-h-96 overflow-auto"
                    {highlight}
                    {article}
                    disableClick={true}
                />
            {/await}
        {/each}
    </div>
{/if}