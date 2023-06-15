<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import { page } from '$app/stores';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { onDestroy } from 'svelte';

    let { note } = $page.params;

    let event: NDKEvent;
    let quotes: any;

    $: note = $page.params.note;

    onDestroy(() => {
        if (quotes) quotes.unsubscribe();
    });

    function eventLoaded(e: CustomEvent) {
        event = e.detail as NDKEvent;
        // quotes = $ndk.storeSubscribe({'#q': [event.id]}, { closeOnEose: true });
    }  
</script>

<svelte:head>
	<title>HIGHLIGHTER.com</title>
	<meta name="description" content="Unleash valuable words from their artificial silos" />
</svelte:head>

{#key note}
    <main class="max-w-xl mx-auto pb-32 flex flex-col gap-6">
        <GenericEventCard
            id={note}
            on:event:load={eventLoaded}
        />

        <!-- {#key $quotes}
            {#if event && $quotes?.length > 0}
                {#each $quotes as quote}
                    <NoteCard note={quote} />
                {/each}
            {/if}
        {/key} -->
    </main>
{/key}