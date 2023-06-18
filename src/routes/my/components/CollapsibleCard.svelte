<script lang="ts">
    import MoreOptionsIcon from '$lib/icons/MoreOptions.svelte';

    import { Dropdown, DropdownItem } from 'flowbite-svelte'

	import UserCard from '$lib/components/UserCard.svelte';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import RelayCard from '$lib/components/relays/RelayCard.svelte';
    import type { NDKEvent, NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tag: NDKTag;
    export let skipFooterForPubkeys: string[] | undefined = undefined;

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

    function remove() {
        dispatch('removeItem', {tag});
    }

    let skipFooter: boolean = true;

    function onEventLoaded(e: CustomEvent) {
        const event: NDKEvent = e.detail;

        skipFooter = !!skipFooterForPubkeys?.includes(event.pubkey);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="w-full relative"
    on:click={() => { skipFooter = false; }}
>
    <div class="absolute -left-10">
        <button class="
            border border-transparent hover:border-zinc-200 hover:bg-zinc-100
            px-2 py-2 rounded-lg
        " on:click|stopPropagation={() => {}}>
            <MoreOptionsIcon class="w-4 h-4 text-black" />
        </button>
        <Dropdown>
            <DropdownItem class="flex flex-row items-center gap-2" on:click={remove}>
                Remove
            </DropdownItem>
        </Dropdown>
    </div>

    {#if tag[0] === 'r'}
        <RelayCard relayUrl={tag[1]} />
    {:else if tag[0] === 'p'}
        <UserCard pubkey={tag[1]} />
    {:else}
        <GenericEventCard
            id={tag[1]}
            {skipFooter}
            expandReplies={false}
            on:eventLoad={onEventLoaded}
        />
    {/if}
</div>