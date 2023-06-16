<script lang="ts">
	import RoundedButton from './../../../../components/RoundedButton.svelte';
    import { currentUser, currentUserFollowPubkeys } from '$lib/store';
    import HighlightList from '$lib/components/HighlightList.svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
        import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import { derived, type Writable } from 'svelte/store';
    import type { NDKEventStore } from '$lib/stores/ndk';
    import ndk from '$lib/stores/ndk';
    import { highlights } from '$lib/stores/highlights';
    import { throttle } from 'throttle-debounce';

    export let scope: string;
    let prevScope: string;

    let filter: NDKFilter | undefined = undefined;

    let renderedHighlights: NDKHighlight[] = [];
    let processedHighlightCount: number;
    let highlightsToShow = 10;

    const throttledRenderHighlights = throttle(10, () => {
        renderedHighlights = $highlights.slice(0, highlightsToShow)
    });

    $: if ($highlights.length !== processedHighlightCount) {
        processedHighlightCount = $highlights.length;
        throttledRenderHighlights();
    }

    function loadMore() {
        highlightsToShow = (highlightsToShow * 1.1) + 20
    }
</script>

<HighlightList items={renderedHighlights} />

<RoundedButton class="mt-8 py-4" on:click={loadMore}>Load More {highlightsToShow}</RoundedButton>