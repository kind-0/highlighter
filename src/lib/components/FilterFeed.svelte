<script lang="ts">
    import ndk from '$lib/stores/ndk';
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
    import { onDestroy } from 'svelte';

    export let filter: NDKFilter;

    onDestroy(() => {
        if (sub) {
            sub.stop();
        }
    })

    let feed: NDKEvent[] = [];

    const sub = $ndk.subscribe(filter, { closeOnEose: false});

    sub.on('event', (e, r) => {
        console.log(`${r.url}: ${e.id}`);
        feed.push(e);
        feed = feed;
    })
</script>

<!-- {JSON.stringify(filter)} -->

{#each feed as event}
    <GenericEventCard
        event={event}
        skipReplies={true}
    />
{/each}