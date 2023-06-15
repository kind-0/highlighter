<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import CloseIcon from '$lib/icons/Close.svelte';

    import { closeModal } from 'svelte-modals';
    import type { NostrEvent } from '@nostr-dev-kit/ndk';
    import { goto } from '$app/navigation';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import Input from '$lib/components/Input.svelte';
    import Textarea from '$lib/components/Textarea.svelte';
    import {  getLists } from "$lib/stores/list";
    import { currentUser } from "$lib/store";

    import NDKList from '$lib/ndk-kinds/lists/index.js';
    import ModalButton from '$lib/components/ModalButton.svelte';

    let name: string;
    let description: string;

    export let kind = 30001;

    async function createNewList() {
        const list = new NDKList($ndk, {kind} as NostrEvent);
        list.name = name;
        list.description = description;
        await list.publish();
        if ($currentUser) {
            getLists($currentUser);
        }
        goto(`/my/lists/${list.encode()}`);
        closeModal();
    }
</script>

<ModalWrapper class="max-w-sm">
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

        <ModalButton on:click={createNewList}>
            CREATE
        </ModalButton>
    </div>
</ModalWrapper>
