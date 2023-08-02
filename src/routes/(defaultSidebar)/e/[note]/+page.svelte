<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import { page } from '$app/stores';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { onDestroy } from 'svelte';

    let { note } = $page.params;

    let event: NDKEvent;
    let quotes: any;

    $: note = $page.params.note;

    onDestroy(() => {
        if (quotes) quotes.unsubscribe();
    });
</script>

<svelte:head>
	<title>{note ?? "HIGHLIGHTER.com"}</title>
	<meta name="description" content="Unleash valuable words from their artificial silos" />
</svelte:head>

{#key note}
    <main class="max-w-xl mx-auto pb-32 flex flex-col gap-6">
        <GenericEventCard
            bech32={note}
            skipTitle={false}
            bind:event
        />
    </main>
{/key}