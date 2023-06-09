<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
    import Name from '$lib/components/Name.svelte';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import RelayCard from '$lib/components/relays/RelayCard.svelte';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';
    import BookmarkList from '../components/bookmark-list/Card.svelte';

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
    {#key tag}
        {#if tag[0] === 'r'}
            <RelayCard relayUrl={tag[1]} />
        {:else if tag[0] === 'p'}
            <UserCard pubkey={tag[1]} />
        {:else if tagIsList}
            <div class="
                shadow
                flex flex-col h-full gap-4
                border border-zinc-200 hover:border-zinc-200
                px-6 pt-6 pb-4 rounded-xl
                bg-white hover:bg-slate-50 transition duration-200 ease-in-out
            " style="max-height: 40rem;">
                <div class="flex-1 truncate px-4 py-2 text-sm">
                    <div class="text-lg font-medium text-gray-900 hover:text-gray-600">
                        <Name pubkey={listData[1]} />'s
                        {listData[2]} list
                    </div>
                </div>
            </div>
        {:else}
            <GenericEventCard
                {tag}
                skipFooter={collapsed}
            />
        {/if}
    {/key}
</div>
{#if !collapsed}
    <div class="flex flex-row gap-2 items-center">
        <button class="text-zinc-500 text-sm" on:click={remove}>Remove</button>
    </div>
{/if}