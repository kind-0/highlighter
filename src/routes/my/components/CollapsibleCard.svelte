<script lang="ts">
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tag: NDKTag;
    export let collapsed = true;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    function remove() {
        dispatch('removeItem', {tag});
    }
</script>

<div on:click={toggleCollapsed}>
    <GenericEventCard
        {tag}
        skipFooter={collapsed}
    />
</div>
{#if !collapsed}
    <div class="flex flex-row gap-2 items-center">
        <button class="text-zinc-500 text-sm" on:click={remove}>Remove</button>
    </div>
{/if}