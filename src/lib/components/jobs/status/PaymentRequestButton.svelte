<script lang="ts">
	import CheckIcon from '$lib/icons/Check.svelte';
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { createEventDispatcher } from "svelte";
    import { pay as payPaymentRequest } from '$lib/utils/pay';
    import ButtonWithBorderGradient2 from '$lib/components/buttons/ButtonWithBorderGradient2.svelte';

    const dispatch = createEventDispatcher();

    export let event: NDKEvent;
    export let pendingAmount: number;

    let paying = false;
    let paid = false;

    async function pay() {
        if (pendingAmount <= 0) return;

        const amountTag = event.getMatchingTags('amount')[0];

        paying = true;

        let pr: string | null

        // check if there is an invoice in it
        if (amountTag && amountTag[2]) {
            // TODO: check if this invoice matches the pending amount
            pr = amountTag[2];
        } else {
            pr = await event.zap(pendingAmount*1000);
        }

        if (pr) {
            payPaymentRequest(pr).then(({preimage}) => {
                paying = false;
                if (preimage) {
                    paid = true;
                    dispatch('paid', { preimage });
                }
            }).catch((e: any) => {
                paying = false;
            })
            // const res = await webln.sendPayment(pr);
            // paying = false;

            // if (res?.preimage) {
            //     paid = true;
            //     dispatch('paid', { preimage: res.preimage });
            // }
        }
    }
</script>

<ButtonWithBorderGradient2 on:click={pay} disabled={paying || paid}>
    {#if !paid}
        Pay {pendingAmount} sats
    {:else}
        <CheckIcon class="w-6 h-6 mr-2" />
        Paid
    {/if}
</ButtonWithBorderGradient2>