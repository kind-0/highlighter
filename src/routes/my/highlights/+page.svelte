<script lang="ts">
    import ndk from "$lib/stores/ndk";

    import HighlightInterface from '$lib/interfaces/highlights';
    import HighlightCard from '$lib/components/highlights/HighlightCard.svelte';
    import { onMount } from 'svelte';
    import NDKHighlight from "$lib/ndk-kinds/highlight";

    let highlights, _highlights: App.Highlight[] = [];

    async function loadHighlights() {
        const user = await $ndk.signer?.user();

		if (!user) {
            setTimeout(() => {
                loadHighlights();
            }, 100);
            return;
		}

		const opts = { pubkeys: [user.hexpubkey()] };
		highlights = HighlightInterface.load(opts);
		return HighlightInterface.startStream(opts);
    }

    onMount(async () => {
        loadHighlights();
    })

    $: {
		_highlights = (($highlights || []) as App.Highlight[]).sort((a, b) => {
			return b.timestamp - a.timestamp;
		});

		_highlights = _highlights;
	}
</script>

<div class="grid grid-flow-row md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
    {#each _highlights as highlight}
        <HighlightCard
            class="max-h-96 overflow-auto"
            highlight={new NDKHighlight($ndk, JSON.parse(highlight.event))}
            disableClick={true}
        />
    {/each}
</div>