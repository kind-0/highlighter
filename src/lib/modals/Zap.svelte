<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import UserCard from '$lib/components/UserCard.svelte';
    import PillButton from '$lib/components/buttons/pill.svelte';
    import Input from '$lib/components/Input.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import { requestProvider } from 'webln';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ModalButton from '$lib/components/ModalButton.svelte';

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

        closeModal();
    }
</script>

<ModalWrapper class="max-w-md">
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>
    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">SPLITS</h2>

        <UserCard pubkey={event.pubkey}>
            <div slot="right">
                ⚡️ {amount}
            </div>
        </UserCard>
    </div>

    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">
            AMOUNT
        </h2>

        <div class="flex flex-row">
            <PillButton bind:group={amount} value="1000">
                👍 1k
            </PillButton>
            <PillButton bind:group={amount} value="5000">
                💜 5k
            </PillButton>
            <PillButton bind:group={amount} value="10000">
                😍 10k
            </PillButton>
            <PillButton bind:group={amount} value="50000">
                🤩 50k
            </PillButton>
            <PillButton bind:group={amount} value="100000">
                🤯 100k
            </PillButton>
        </div>
    </div>

    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">
            COMMENT
        </h2>

        <Input
            type="text"
            maxlength="50"
            placeholder="Add a comment..."
            bind:value={comment} />
    </div>

    <ModalButton on:click={zap}>
        ZAP
    </ModalButton>
</ModalWrapper>
