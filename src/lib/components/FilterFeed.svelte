<script lang="ts">
    import ndk from '$lib/stores/ndk';
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
    import { onDestroy } from 'svelte';

    export let filter: NDKFilter;
    export let feedLength: number = 0;
    export let eventFilter: (e: NDKEvent) => boolean = () => true;

    let feed: NDKEvent[] = [];
    let eventIds: Set<string> = new Set();

    onDestroy(() => {
        if (sub) {
            sub.stop();
        }
    })

    const sub = $ndk.subscribe(filter, { closeOnEose: false });

    sub.on('event', (e, r) => {
        if (eventIds.has(e.id)) {
            return;
        }
        if (eventFilter(e)) {
            let i = 0;
            while (i < feed.length && feed[i].created_at! > e.created_at!) {
                i++;
            }
            feed.splice(i, 0, e);
            eventIds.add(e.id);
        }
        feedLength = feed.length;
        feed = feed;
    })
</script>

{#if feed.length === 0}
    <div class="flex flex-col items-center justify-center gap-2">
        <div class="text-lg font-semibold">No events found</div>
    </div>
{/if}

<div class="flex flex-col gap-8">
    {#each feed as event}
        <GenericEventCard
            event={event}
            skipReplies={true}
        />
    {/each}
</div>