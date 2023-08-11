<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import Input from '$lib/components/Input.svelte';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import { requestProvider } from 'webln';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ZapUserSplit from '$lib/components/ZapUserSplit.svelte';

    export let event: NDKEvent;

    let amount = '1000';
    let comment = '';

    async function zap() {
        event.ndk = $ndk;
        let pr = await event.zap(parseInt(amount)*1000, comment);

        if (!pr) {
            console.log('no payment request');
            return;
        }

        closeModal();

        try {
            const webln = await requestProvider();
            webln.sendPayment(pr);
            // TODO we should check here if the payment was successful, with a timer
            // that is canceled here; if the timer doesn't come back, show the modal again
            // or instruct the user to do something with the failed payment
        } catch (err: any) {
            console.log(err);
            return;
        }
    }
</script>

<ModalWrapper class="w-[374px]" title="Zap">
    <div class="flex flex-col gap-3">
        <div class="text-zinc-400 text-[10px] font-semibold tracking-widest">SPLITS</div>
        <ZapUserSplit pubkey={event.pubkey} split={100}/>
        <!-- TODO add other people involved in the highlight? -->
    </div>

    <div class="flex flex-col gap-3 mt-[22px]">
        <div class="text-zinc-400 text-[10px] font-semibold tracking-widest">AMOUNT</div>

        <div class="flex flex-row gap-4">
            <div class="flex flex-row gap-3">
                <div class="w-11 h-11 bg-neutral-800 rounded-full"></div>
                <div class="w-11 h-11 bg-neutral-800 rounded-full"></div>
                <div class="w-11 h-11 bg-neutral-800 rounded-full"></div>
                <div class="w-11 h-11 bg-neutral-800 rounded-full"></div>
                <!-- <PillButton bind:group={amount} value="1000">
                    👍 1k
                </PillButton> -->
            </div>
            <div class="w-full h-11 rounded-[22px] border border-neutral-800"></div>
        </div>
    </div>

    <div class="flex flex-col gap-3 mt-[22px]">
        <div class="w-full h-11 rounded-[22px] border border-neutral-800">
        <Input
            type="text"
            maxlength="50"
            class="
                block w-full rounded-full
                !bg-base-200
                text-base-100-content
            "
            placeholder="Add a comment..."
            bind:value={comment} />
        </div>

    </div>
    <button class="w-[330px] h-11 rounded-[22px] border border-red-400">Zap</button>

</ModalWrapper>
