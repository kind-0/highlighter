<script lang="ts">
    import CloseIcon from '$lib/icons/Close.svelte';
    import ndk from '$lib/stores/ndk';
    import ClickToAddComment from '$lib/components/ClickToAddComment.svelte';
    import { NDKEvent, NDKUser, type NDKSigner, type NostrEvent } from '@nostr-dev-kit/ndk';
    import { closeModal } from 'svelte-modals';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ModalButton from '$lib/components/ModalButton.svelte';
    import { npubSigners } from '$lib/stores/signer';
    import EventVisibility from '$lib/components/events/editor/EventVisibility.svelte';

    export let event: NDKEvent;
    export let delegatedSigner: NDKSigner | undefined = undefined;
    export let delegatedUser: NDKUser | undefined = undefined;

    let comment: string;
    let visibility: string = delegatedSigner ? 'Delegated' : 'Public';

    if (event.kind === 4) {
        visibility = 'Secret';
    }

    function getSigner(): NDKSigner {
        if (visibility === 'Delegated') {
            return delegatedSigner!;
        }

        return $ndk.signer!;
    }

    async function save() {
        const signer = getSigner();
        const user = await signer.user();

        if (comment && comment.length > 0) {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: comment,
                pubkey: user.hexpubkey(),
            } as NostrEvent)
            commentEvent.tag(event, 'reply');

            if (event.kind === 4) {
                commentEvent.kind = 4;
                await commentEvent.encrypt(event.author);
            }

            await commentEvent.sign(signer);
            await commentEvent.publish();

            closeModal();
        }
    }
</script>

<ModalWrapper>
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>

    <div class="flex flex-col gap-8">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">REPLY</h2>

        <div class="flex flex-col gap-8">
            <GenericEventCard
                draggable={false}
                {event}
                skipTitle={true}
                skipButtons={true}
                skipReplies={true}
            />

            <ClickToAddComment bind:value={comment} show={true} cancelButton={false} />
        </div>

        {visibility}

        {#if delegatedSigner}
            <EventVisibility
                placement={'top-start'}
                {delegatedSigner}
                {delegatedUser}
                bind:value={visibility}
            />
        {/if}

        <ModalButton on:click={save}>
            Publish
        </ModalButton>
    </div>
</ModalWrapper>
