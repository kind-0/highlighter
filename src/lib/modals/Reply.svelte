<script lang="ts">
    import CloseIcon from '$lib/icons/Close.svelte';
    import ndk from '$lib/stores/ndk';
    import ClickToAddComment from '$lib/components/ClickToAddComment.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
    import { closeModal } from 'svelte-modals';
    import NoteCard from '$lib/components/notes/card.svelte';
    import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';

    export let event: NDKEvent;
    export let note: App.Note | undefined = undefined;

    let comment: string;

    async function save() {
        if (comment && comment.length > 0) {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: comment,
            } as NostrEvent)
            commentEvent.tag(event, 'reply');
            await commentEvent.sign();
            await commentEvent.publish();
            closeModal();
        }
    }
</script>

<ModalWrapper klass="bg-zinc-100">
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>

    <div class="flex flex-col gap-8">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">REPLY</h2>

        <div class="flex flex-col gap-8">
            <NoteCard
                {note}
                skipTitle={true}
                skipButtons={true}
                skipReplies={true}
            />

            <ClickToAddComment bind:value={comment} show={true} cancelButton={false} />
        </div>

        <div class="flex flex-row justify-between">
            <div class="text-xs text-zinc-500">
            </div>

            <RoundedButton class="rounded-lg uppercase text-lg" on:click={save}>
                Publish
            </RoundedButton>
        </div>
    </div>
</ModalWrapper>
