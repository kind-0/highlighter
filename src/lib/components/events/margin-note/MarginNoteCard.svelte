<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import HighlightContent from "$lib/components/highlights/HighlightContent.svelte";
    import EventCard from "../EventCard.svelte";
    import HighlightHeader from "$lib/components/highlights/HighlightHeader.svelte";
    import EventContent from '$lib/components/events/content.svelte';
    import { removeQuotedEvent, fetchQuotedHighlight } from './utils';
    import type NDKHighlight from "$lib/ndk-kinds/highlight";

    /**
     * Event to render
     */
    export let event: NDKEvent;

    export let skipTitle = false;
    export let skipHighlight = false;

    let highlight: NDKHighlight | null;

    fetchQuotedHighlight(event).then(h => highlight = h)
</script>

{#if highlight}
    <EventCard
        {event}
        authorAction="margin note by"
        skipHeader={skipTitle}
        class={$$props.class}
        on:mouseenter
        on:mouseleave
    >
        <div slot="header">
            {#if !skipTitle}
                <HighlightHeader {highlight} />
            {/if}
        </div>

        {#if !skipHighlight}
            <div class="text-sm">
                <HighlightContent
                    {highlight}
                />
            </div>
        {/if}

        <div class="text-base-100-content">
            <EventContent
                note={removeQuotedEvent(event)}
                tags={event.tags}
                kind={event.kind}
            />
        </div>
    </EventCard>
{/if}