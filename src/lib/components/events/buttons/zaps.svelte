<script lang="ts">
    import { openModal } from 'svelte-modals'
    import { Tooltip } from 'flowbite-svelte';

    import ZapIcon from '$lib/icons/Zap.svelte';

    import ZapModal from '$lib/modals/Zap.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { type NDKEvent, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';
    import { nicelyFormattedSatNumber } from '$lib/utils';
    import { currentUser } from '$lib/store';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';

    export let event: NDKEvent;
    let zaps: NDKEventStore<NDKEvent>;
    let zappedAmount: number = 0;

    if (event?.id) {
        let eventId = event.id;

        let zaps;

        onMount(() => {
            zaps = $ndk.storeSubscribe(
                { kinds: [ 9735 ], '#e': [eventId] },
                { closeOnEose: false, groupableDelay: 2500 }
            );
            // console.log(`querying for zaps for event ${eventId}`);
        });
    }

    onDestroy(() => {
        if (zaps) zaps.unsubscribe();
    });


    $: if ($zaps) {
        zappedAmount = $zaps.reduce((acc: number, zap: NDKEvent) => {
            const zapInvoice = zapInvoiceFromEvent(zap);
            if (!zapInvoice) return acc;

            console.log('zaps loaNing', zapInvoice);
            return acc + zapInvoice.amount;
        }, 0);
    }
</script>

{#if event?.id && $currentUser}
    <button class="
        text-slate-500 hover:text-orange-500
        flex flex-row items-center gap-2
        {$$props.class}
    " on:click={() => { openModal(ZapModal, { event }) }}>
        <ZapIcon class="w-4 h-4" />
        {#if zappedAmount > 0}
            <div class="text-sm">{nicelyFormattedSatNumber(zappedAmount)}</div>
        {/if}
    </button>
    <Tooltip  color="black">Zap</Tooltip>
{/if}
