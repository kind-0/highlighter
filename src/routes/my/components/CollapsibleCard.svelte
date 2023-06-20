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
    export let skipTitle: boolean = false;
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
        <button class="w-5 h-5">
            <MoreOptionsIcon class="text-black" />
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
            {skipTitle}
            {skipFooter}
            expandReplies={false}
            on:eventLoad={onEventLoaded}
        />
    {/if}
</div>