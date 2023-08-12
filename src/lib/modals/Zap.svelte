<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { requestProvider } from 'webln';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ZapUserSplit from '$lib/components/ZapUserSplit.svelte';
    import CircularIconButton from '$lib/components/buttons/CircularIconButton.svelte';
    import Heart from '$lib/icons/Heart.svelte';
    import Like from '$lib/icons/Like.svelte';
    import Fire from '$lib/icons/Fire.svelte';
    import Rocket from '$lib/icons/Rocket.svelte';
    import ZapSent from '$lib/icons/ZapSent.svelte';
    import SubtleButton from '$lib/components/buttons/SubtleButton.svelte';
    import CheckSimple from '$lib/icons/CheckSimple.svelte';

    export let event: NDKEvent;

    let zapSent = false;

    let amount = '1000';
    let customAmount = '';
    let zapAmount = '1000';
    let hasCustomAmountFocus = false;
    let isValidCustomAmount = true;
    let isCustomAmountSelected = false;
    let comment = '';
    let zapButtonLabel: string;
    let zapButtonEnabled = true;
    let zapping = false;

    $: {
        switch (amount) {
            case "1000":
                isCustomAmountSelected = false;
                zapButtonLabel = "Zap 1K";
                zapAmount = amount;
                break;
            case "10000":
                isCustomAmountSelected = false;
                zapButtonLabel = "Zap 10K";
                zapAmount = amount;
                break;
            case "50000":
                isCustomAmountSelected = false;
                zapButtonLabel = "Zap 50K";
                zapAmount = amount;
                break;
            case "100000":
                isCustomAmountSelected = false;
                zapButtonLabel = "Zap 100K";
                zapAmount = amount;
                break;
            default:
                if (customAmount && isValidCustomAmount){
                    zapButtonLabel = `Zap ${customAmount} sats`;
                    zapAmount = customAmount;
                } else {
                    zapButtonLabel = "Zap";
                }
                break;
        }
    }

    $: {
        if (amount) {
            zapButtonEnabled = true;
        } else {
            if (customAmount && isValidCustomAmount){
                zapButtonEnabled = true;
            } else {
                zapButtonEnabled = false;
            }
        }
    }

    let focusCustomInput = () => {
        hasCustomAmountFocus = true;
        if (customAmount) {
            isCustomAmountSelected = true;
            amount = ''
        }
    }

    let validateCustomAmount = () => {
        // Should be positive integer
        isValidCustomAmount = /^\+?(0|[1-9]\d*)$/.test(customAmount);
        if (isValidCustomAmount){
            amount = '';
            isCustomAmountSelected = true;
        }
    }

    let clearCustomAmount = () => {
        if (!isValidCustomAmount) {
            customAmount = ''
            isValidCustomAmount = true
            isCustomAmountSelected = false
        }
    }

    async function zap() {
        // closeModal();

        event.ndk = $ndk;
        zapping = true;
        let pr = await event.zap(parseInt(zapAmount)*1000, comment);

        if (!pr) {
            console.log('no payment request');
            return;
        }

        try {
            const webln = await requestProvider();
            await webln.sendPayment(pr);
            zapping = false;
            zapSent = true;
            // TODO we should check here if the payment was successful, with a timer
            // that is canceled here; if the timer doesn't come back, show the modal again
            // or instruct the user to do something with the failed payment
        } catch (err: any) {
            zapping = false;
            return;
        }
    }
</script>

<ModalWrapper class="w-[374px]" bodyClass="p-[22px]" title="Zap">
    {#if zapSent}
        <div class="flex flex-col items-center justify-center">
            <div>
                <ZapSent class="h-[267px]"/>
            </div>
            <SubtleButton handleClick={closeModal} class="w-fit">
                <span class="glow flex items-center gap-3 text-base-100-content text-base leading-normal font-normal" slot="btn-content"><CheckSimple class="text-accent"/> Zap Sent</span>
            </SubtleButton>
        </div>

    {:else}
        <div class="flex flex-col gap-[22px]">
            <div class="flex flex-col gap-3">
                <div class="text-base-300-content text-[10px] font-semibold tracking-widest">SPLITS</div>
                <ZapUserSplit pubkey={event.pubkey} split={100}/>
                <!-- TODO add other people involved in the highlight? -->
            </div>

            <div class="flex flex-col gap-3">
                <div class="text-base-300-content text-[10px] font-semibold tracking-widest">AMOUNT</div>

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
                                form-input text-center w-full  rounded-full h-11 mb-2
                                border-1 {isCustomAmountSelected ? 'border-accent': 'border-neutral-800'}
                                focus:ring-transparent focus:border-accent
                                {isValidCustomAmount ? '!bg-transparent' : '!bg-error !bg-opacity-20'}
                            "
                            bind:value={customAmount}
                            on:focus={focusCustomInput}
                            on:blur={clearCustomAmount}
                            on:input={validateCustomAmount}/>
                        <span class="text-xs text-center font-normal text-base-100-content">
                            Custom
                        </span>
                    </div>
                </div>
            </div>

            <input
                type="text"
                maxlength="50"
                class="
                    form-input text-start text-base px-6 w-full  rounded-full h-11
                    border-1 border-neutral-800 focus:ring-transparent focus:border-neutral-800
                    !bg-transparent
                "
                placeholder="Add a comment..."
                bind:value={comment}/>

            <button on:click={zap} class="btn btn-outline {!zapButtonEnabled ? 'btn-disabled' : ''} btn-rounded-full rounded-full border-accent bg-transparent text-base-100-content text-base normal-case font-normal leading-normal hover:border-accent hover:bg-accent hover:bg-opacity-20 hover:text-base-100-content">
                {#if zapping}
                    <span class="loading loading-sm opacity-50"></span>
                {:else}
                    {zapButtonLabel}
                {/if}
            </button>
        </div>
    {/if}
</ModalWrapper>
