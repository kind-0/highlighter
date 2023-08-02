<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import Input from '$lib/components/Input.svelte';
    import { sortedListWithKind, sortedLists } from '$lib/stores/list';
    import type NDKList from '$lib/ndk-kinds/lists';

    export let event: NDKEvent;
    export let listKind: number = 30001;

    let newListName: string;

    async function addToList(list: NDKList) {
        await list.addItem(event);
        await list.sign();
        await list.publish();
        closeModal();
    }

    async function createNewList() {
        const user = await $ndk.signer?.user();

        if (!user) {
            return;
        }

        const newListEvent = new NDKEvent($ndk, {
            kind: listKind,
            tags: [
                ['d', newListName ],
                event.tagReference(),
            ],
        } as NostrEvent);
        await newListEvent.publish();
        closeModal();

        newListName = '';
    }

    const listWithKind = sortedListWithKind(listKind);
</script>

<ModalWrapper class="max-w-sm">
    <button class="
        transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>
    <div class="flex flex-col gap-8">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">BOOKMARK</h2>

        <ul class="
            rounded-lg
            divide-y divide-base-300
            border border-base-300
            overflow-y-auto
            w-full
            max-h-96
        ">
            {#each $listWithKind as list}
                <li>
                    <button class="
                        p-3 truncate
                        w-full
                        hover:text-accent
                        text-left
                    " on:click={()=>{addToList(list)}}>{list.name}</button>
                </li>
            {/each}
        </ul>

        <div class="join join-vertical md:join-horizontal">
            <Input type="text" klass="
                join-item
            " placeholder="New List" bind:value={newListName} />

            <button class="
                btn btn-primary
                join-item
                w-1/3
            " on:click={createNewList}>
                New List
            </button>
        </div>
    </div>
</ModalWrapper>
