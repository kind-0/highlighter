<script lang="ts">
    import CloseIcon from '$lib/icons/Close.svelte';
    import ndk from '$lib/stores/ndk';
    import ClickToAddComment from '$lib/components/ClickToAddComment.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
    import { closeModal } from 'svelte-modals';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';

    export let event: NDKEvent;
    export let id: string;

    let comment: string;

    async function save() {
        if (comment && comment.length > 0) {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: `nostr:${event.encode()}\n${comment}`,
                tags: [
                    ['q', event.tagId(), 'quote']
                ]
            } as NostrEvent)
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
        <h2 class="text-zinc-500 font-semibold text-base uppercase">REPOST</h2>

        <div class="flex flex-col gap-8">
            <GenericEventCard
                {id}
                skipTitle={true}
                skipButtons={true}
            />

            <ClickToAddComment bind:value={comment} />
        </div>

        <div class="flex flex-row justify-between">
            <div class="text-xs text-zinc-500">
            </div>

            <RoundedButton on:click={save}>
                Publish
            </RoundedButton>
        </div>
    </div>
</ModalWrapper>