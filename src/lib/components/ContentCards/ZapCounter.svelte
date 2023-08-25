<script lang="ts">
    import ZapCounterIcon from "$icons/ZapCounterIcon.svelte";
    import { nicelyFormattedMilliSatNumber } from "$utils";
    import { zapInvoiceFromEvent, type NDKEvent } from "@nostr-dev-kit/ndk";
    import type { NDKEventStore, ExtendedBaseType } from "@nostr-dev-kit/ndk-svelte";
    import { onDestroy } from "svelte";
    import ndk from '$lib/stores/ndk';
    
    export let event: NDKEvent;
    let eventId: string;
    let zappedAmount: number = 0;
    let zaps: NDKEventStore<ExtendedBaseType<NDKEvent>>;

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

    $: if ($zaps) {
        zappedAmount = $zaps.reduce((acc: number, zap: NDKEvent) => {
            const zapInvoice = zapInvoiceFromEvent(zap);

            if (!zapInvoice) return acc;

            return zapInvoice.amount;
        }, 0);
    }

</script>

<div class="h-7 w-fit flex items-center px-3 gap-2 bg-base-200  rounded-full">
    <span class="text-right text-xs uppercase font-normal">{nicelyFormattedMilliSatNumber(zappedAmount)}</span>
    <ZapCounterIcon />
</div>