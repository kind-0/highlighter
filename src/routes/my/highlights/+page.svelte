<script lang="ts">
    import ndk, { type NDKEventStore } from "$lib/stores/ndk";

    import HighlightInterface from '$lib/interfaces/highlights';
    import HighlightCard from '$lib/components/highlights/HighlightCard.svelte';
    import { onMount } from 'svelte';
    import NDKHighlight from "$lib/ndk-kinds/highlight";
  import type { NDKEvent } from "@nostr-dev-kit/ndk";

    const highlights: NDKEventStore<NDKHighlight>;

    onMount(async () => {
        const user = await $ndk.signer?.user();

        highlights = $ndk.storeSubscribe({
            kinds: [9802],
            authors: [user.hexpubkey()]
        }, { closeOnEose: false });
    })
</script>

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