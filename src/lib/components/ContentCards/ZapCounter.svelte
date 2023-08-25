<script lang="ts">
    import ZapCounterIcon from "$icons/ZapCounterIcon.svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$stores/ndk";
    import { nicelyFormattedMilliSatNumber } from "$utils";
    import { onDestroy } from "svelte";
    import { zapInvoiceFromEvent, type NDKEvent } from "@nostr-dev-kit/ndk";
    import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";

    export let event: NDKEvent;

    let zaps: NDKEventStore<NDKEvent>;

    zaps = $ndk.storeSubscribe(
        { kinds: [ 9735 ], ...event.filter() },
        { closeOnEose: false, groupableDelay: 2500 }
    );

    onDestroy(() => {
        if (zaps) zaps.unsubscribe();
    });

    let zappedAmount: number = 0;
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

</script>

<div class="h-7 w-fit flex items-center px-3 gap-2 bg-base-200  rounded-full">
    <span class="text-right text-xs uppercase font-normal">{nicelyFormattedMilliSatNumber(zappedAmount)}</span>
    <ZapCounterIcon />
</div>