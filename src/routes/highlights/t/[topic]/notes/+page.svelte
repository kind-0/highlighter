<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import { page } from "$app/stores";
    // import HighlightFilter from "../../../HighlightFilter.svelte";

    import ndk from '$lib/stores/ndk';

    import type { NDKEventStore } from "$lib/stores/ndk";
    import type { NDKEvent, NDKSubscription } from "@nostr-dev-kit/ndk";

    let topic: string
    let prevTopic: string
    let quotedHighlights: NDKEventStore<NDKEvent>;

    $: topic = $page.params.topic;

    $: if (topic && topic !== prevTopic) {
        prevTopic = topic;
        subscribe(topic);
    }

    function subscribe(topic: string) {
        if (quotedHighlights) quotedHighlights.stop();

        quotedHighlights = $ndk.storeSubscribe({
            "kinds": [1],
            "#k": ["9802"],
        });
    }
</script>


<div class="flex flex-col gap-6 mb-2">
    <!-- <HighlightFilter /> -->
</div>

{#if !quotedHighlights || $quotedHighlights.length === 0}
    No quotes to show
{:else if quotedHighlights}
    <div class="flex flex-col gap-8">
        {#each $quotedHighlights as quote}
            <GenericEventCard event={quote} />
        {/each}
    </div>
{/if}