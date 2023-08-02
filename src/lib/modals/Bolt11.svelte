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

    export let paymentRequest: string;
</script>

<ModalWrapper class="max-w-md">
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>
    <div class="flex flex-col gap-8">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">Lightning Invoice</h2>
    </div>

    <textarea class="input">{paymentRequest}</textarea>
    <a href={`lightning:${paymentRequest}`} class="btn btn-primary">Open</a>

    <ModalButton on:click={closeModal}>
        Close
    </ModalButton>
</ModalWrapper>
