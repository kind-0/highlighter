<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import BookmarkListInterface from '$lib/interfaces/bookmark-list';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';

    import { closeModal } from 'svelte-modals';
    import type { NostrEvent } from '@nostr-dev-kit/ndk/lib/src/events';
    import { goto } from '$app/navigation';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import Input from '$lib/components/Input.svelte';
    import Textarea from '$lib/components/Textarea.svelte';
  import RoundedButton from '../../../routes/(main)/components/RoundedButton.svelte';

    let currentNpub;
    let bookmarkLists, _bookmarkLists: App.BookmarkList[] = [];
    let name: string;
    let description: string;

    async function loadbookmarkLists() {
        const user = await $ndk.signer?.user();

		if (!user) {
            setTimeout(() => {
                loadbookmarkLists();
            }, 100);
            return;
		}

		currentNpub = user.npub;

		const opts = { pubkeys: [user.hexpubkey()] };
		bookmarkLists = BookmarkListInterface.load(opts);
		return BookmarkListInterface.startStream(opts);
    }

    async function createNewList() {
        const user = await $ndk.signer?.user();

        if (!user) {
            return;
        }

        const newListEvent = new NDKEvent($ndk, {
            kind: 30001,
            tags: [
                ['d', name ],
            ],
        } as NostrEvent);
        if (description) {
            newListEvent.tags.push(['d', description]);
        }
        await newListEvent.publish();
        goto(`/my/lists/${newListEvent.encode()}`);
        closeModal();
    }
</script>

<ModalWrapper klass="max-w-sm">
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>
    <div class="flex flex-col gap-8">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">NEW LIST</h2>

        <div class="flex flex-col">
            <Input type="text" class="
                rounded-t-lg
                w-full
                border-b-0
                text-xl
            " placeholder="Name" bind:value={name} autofocus />
            <Textarea class="
                rounded-b-lg
                w-full text-xl
            " placeholder="Description" bind:value={description} />
        </div>

        <RoundedButton klass="
            text-lg py-2 font-bold rounded-xl w-full
        " on:click={createNewList}>
            CREATE
        </RoundedButton>
    </div>
</ModalWrapper>
