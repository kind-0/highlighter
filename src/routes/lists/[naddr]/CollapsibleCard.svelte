<script lang="ts">
    import MoreOptionsIcon from '$lib/icons/MoreOptions.svelte';

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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="w-full flex flex-row items-start gap-2 group"
>
    <div class="w-full" on:click={() => { skipFooter = !skipFooter; }}>
        {#if tag[0] === 'r'}
            <RelayCard
                relayUrl={tag[1]}
                class="w-full"
            />
        {:else if tag[0] === 'p'}
            <UserCard pubkey={tag[1]} />
        {:else}
            <GenericEventCard
                id={tag[1]}
                skipTitle={skipFooter}
                {skipFooter}
                expandReplies={false}
                on:eventLoad={onEventLoaded}
            />
        {/if}
    </div>

    <div class="dropdown">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label tabindex="0" class="w-5 h-5 opacity-0 group-hover:opacity-100 focus:opacity-100">
            <MoreOptionsIcon class="w-5 h-5" />
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box">
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li class="flex flex-row items-center gap-2" on:click={remove}>
                <button class="btn btn-ghost btn-sm">
                    Remove
                </button>
            </li>
        </ul>
    </div>
</div>