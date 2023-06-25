<script lang="ts">
    import HighlightList from '$lib/components/HighlightList.svelte';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import { highlights } from '$lib/stores/highlights';
    import { throttle } from 'throttle-debounce';
    import Button from '$lib/components/buttons/Button.svelte';

    export let scope: string;

    let renderedHighlights: NDKHighlight[] = [];
    let processedHighlightCount: number;
    let highlightsToShow = 10;

    const throttledRenderHighlights = throttle(10, () => {
        const addedIds = new Set();
        renderedHighlights = $highlights.slice(0, highlightsToShow)
            .filter(h => {
                if (addedIds.has(h.id)) {
                    return false;
                }

                addedIds.add(h.id);
                return true;
            });
    });

    $: if ($highlights.length !== processedHighlightCount) {
        processedHighlightCount = $highlights.length;
        throttledRenderHighlights();
    }

    function loadMore() {
        highlightsToShow = (highlightsToShow * 1.1) + 20
        throttledRenderHighlights();
    }
</script>

<HighlightList items={renderedHighlights} />

<Button type="secondary" class="mt-8 py-3 w-full" on:click={loadMore}>Load More</Button>