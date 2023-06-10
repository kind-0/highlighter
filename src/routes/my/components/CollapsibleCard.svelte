<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import RelayCard from '$lib/components/relays/RelayCard.svelte';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tag: NDKTag;
    export let collapsed = true;

    let tagIsList = false;
    let listData: [number, string, string];

    if (tag[0] === 'a') {
        const data = tag[1]?.split(':');

        if (data) {
            listData = [ parseInt(data[0]), data[1], data[2] ];

            if (listData[0] >= 30000 && listData[0] < 40000) {
                tagIsList = true;
            }
        }
    }

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    function remove() {
        dispatch('removeItem', {tag});
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={toggleCollapsed}>
        {#if tag[0] === 'r'}
            <RelayCard relayUrl={tag[1]} />
        {:else if tag[0] === 'p'}
            <UserCard pubkey={tag[1]} />
        {:else}
            <GenericEventCard
                id={tag[1]}
                skipFooter={collapsed}
            />
        {/if}
</div>
{#if !collapsed}
    <div class="flex flex-row gap-2 items-center">
        <button class="text-zinc-500 text-sm" on:click={remove}>Remove</button>
    </div>
{/if}