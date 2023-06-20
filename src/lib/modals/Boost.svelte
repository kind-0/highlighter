<script lang="ts">
    import CloseIcon from '$lib/icons/Close.svelte';
    import ndk from '$lib/stores/ndk';
    import ClickToAddComment from '$lib/components/ClickToAddComment.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
    import { closeModal } from 'svelte-modals';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import ModalButton from '$lib/components/ModalButton.svelte';

    export let event: NDKEvent;
    export let id: string;

    let comment: string;
    let isRepost: boolean;

    $: isRepost = !(comment && comment.length > 0);

    async function save() {
        if (isRepost) {
            await event.repost();
            closeModal();
        } else {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: `nostr:${event.encode()}\n${comment}`,
                tags: [
                    ['q', event.tagId(), 'quote'],
                    ['k', event.kind?.toString()]
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
                bech32={id}
                skipTitle={true}
                skipButtons={true}
                skipReplies={true}
            />

            <ClickToAddComment bind:value={comment} />
        </div>

        <ModalButton on:click={save}>
            {#if isRepost}
                Repost
            {:else}
                Publish
            {/if}
        </ModalButton>
    </div>
</ModalWrapper>