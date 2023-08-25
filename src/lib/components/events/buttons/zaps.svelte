<script lang="ts">
    import { openModal } from 'svelte-modals'

    import ZapIcon from '$lib/icons/Zap.svelte';

    import ZapModal from '$lib/modals/Zap.svelte';
    import { onDestroy } from 'svelte';
    import { type NDKEvent, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';
    import { nicelyFormattedMilliSatNumber } from '$lib/utils';
    import { currentUser } from '$lib/store';
    import ndk from '$stores/ndk';
    import type { NDKEventStore } from '@nostr-dev-kit/ndk-svelte';

    export let event: NDKEvent;
    let eventId: string;
    let zaps: NDKEventStore<NDKEvent>;
    export let zappedAmount: number = 0;

    onDestroy(() => {
        if (zaps) zaps.unsubscribe();
    });

    $: if (event?.id && event.id !== eventId) {
        eventId = event.id;
        zaps?.unsubscribe();

        zaps = $ndk.storeSubscribe(
            { kinds: [ 9735 ], '#e': [event.id] },
            { closeOnEose: false, groupableDelay: 2500 }
        );
    }

    let zappedByCurrentUser: boolean = false;

    $: if ($zaps) {
        zappedAmount = $zaps.reduce((acc: number, zap: NDKEvent) => {
            const zapInvoice = zapInvoiceFromEvent(zap);
            if (!zapInvoice) return acc;

            if (zapInvoice.zappee === $currentUser?.hexpubkey()) {
                zappedByCurrentUser = true;
            }

            return acc + zapInvoice.amount;
        }, 0);
    }

    let tooltip: string;
    $: tooltip = $currentUser ? 'Zap' : 'You are not logged in';

</script>

{#if event?.id && $currentUser}
    <div class="tooltip flex flex-row items-center gap-1.5" data-tip={tooltip}>
        <button
            class="flex flex-row items-center gap-1.5"
            class:cursor-not-allowed={!$currentUser}
            on:click={() => { openModal(ZapModal, { event }) }}
        >
            <ZapIcon class="
                w-4 h-4
                {zappedByCurrentUser ? 'text-primary-500' : ''}
                {$$props.class}" />
            {#if zappedAmount > 0}
                <div class="
                text-sm
                {zappedByCurrentUser ? 'text-primary-500' : ''}
                ">{nicelyFormattedMilliSatNumber(zappedAmount)}</div>
            {/if}
        </button>
    </div>
{/if}
