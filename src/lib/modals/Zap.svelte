<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import { requestProvider } from 'webln';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ZapUserSplit from '$lib/components/ZapUserSplit.svelte';
    import CircularIconButton from '$lib/components/buttons/CircularIconButton.svelte';
    import Heart from '$lib/icons/Heart.svelte';
    import Like from '$lib/icons/Like.svelte';
    import Fire from '$lib/icons/Fire.svelte';
    import Rocket from '$lib/icons/Rocket.svelte';

    export let event: NDKEvent;

    let amount = '1000';
    let customAmount = '';
    let hasCustomAmountFocus = false;
    let isValidCustomAmount = true;
    let comment = '';
    let zapButtonLabel: string;

    $: {
        switch (amount) {
            case "1000":
                zapButtonLabel = "Zap 1K"
                break;
            case "10000":
                zapButtonLabel = "Zap 10K"
                break;
            case "50000":
                zapButtonLabel = "Zap 50K"
                break;
            case "100000":
                zapButtonLabel = "Zap 100K"
                break;
            default:
                if (isValidCustomAmount){
                    zapButtonLabel = `Zap ${customAmount} sats`
                } else {
                    zapButtonLabel = "Zap"
                }
                break;
        }
    }

    let focusCustomInput = () => {
        console.log("focusCustom!!!")
        hasCustomAmountFocus = true;
        if (customAmount) {
            amount = ''
        }
    }

    let validateAmount = () => {
        console.log(customAmount)
        isValidCustomAmount = /^\+?(0|[1-9]\d*)$/.test(customAmount)
        if (isValidCustomAmount){
            amount = ''
        }
    }

    let clearCustomAmount = () => {
        if (!isValidCustomAmount) {
            customAmount = ''
            isValidCustomAmount = true
        }
    }

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

<ModalWrapper class="w-[374px]" bodyClass="p-[22px]" title="Zap">
    <div class="flex flex-col gap-[22px]">
        <div class="flex flex-col gap-3">
            <div class="text-zinc-400 text-[10px] font-semibold tracking-widest">SPLITS</div>
            <ZapUserSplit pubkey={event.pubkey} split={100}/>
            <!-- TODO add other people involved in the highlight? -->
        </div>

        <div class="flex flex-col gap-3">
            <div class="text-zinc-400 text-[10px] font-semibold tracking-widest">AMOUNT</div>

            <div class="flex flex-row gap-4">
                <div class="flex flex-row gap-3">
                    <CircularIconButton title={"1K"} bind:group={amount} value={"1000"}>
                        <Like />
                    </CircularIconButton>
                    <CircularIconButton title={"10K"} bind:group={amount} value={"10000"}>
                        <Heart />
                    </CircularIconButton>
                    <CircularIconButton title={"50K"} bind:group={amount} value={"50000"}>
                        <Fire />
                    </CircularIconButton>
                    <CircularIconButton title={"100K"} bind:group={amount} value={"100000"}>
                        <Rocket />
                    </CircularIconButton>
                </div>
                <div class="w-full flex flex-col items-center">
                    <input
                        type="text"
                        maxlength="50"
                        class="
                            form-input text-center w-full  rounded-full h-11 mb-2 border-1 border-neutral-800
                            focus:border-0
                            focus:ring-1 focus:ring-inset focus:ring-accent
                            {isValidCustomAmount ? '!bg-transparent' : '!bg-red-400 !bg-opacity-20'}
                        "
                        bind:value={customAmount}
                        on:focus={focusCustomInput} 
                        on:blur={clearCustomAmount}
                        on:input={validateAmount}/>
                    <span class="text-xs text-center font-normal text-base-100-content">
                        Custom
                    </span>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-3">
            <div class="w-full h-11 rounded-[22px]">
            <input
                type="text"
                maxlength="50"
                class="
                    block w-full rounded-full
                    !bg-base-200
                    text-base-100-content
                    px-6 text-xs h-11
                "
                placeholder="Add a comment..."
                bind:value={comment} />
            </div>

        </div>
        <button class="w-full h-11 rounded-[22px] border border-red-400 ">{zapButtonLabel}</button>
    </div>

</ModalWrapper>
