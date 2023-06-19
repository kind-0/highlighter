<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

    import { closeModal } from 'svelte-modals';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import Input from '$lib/components/Input.svelte';
    import { sortedLists } from '$lib/stores/list';
    import type NDKList from '$lib/ndk-kinds/lists';

    export let event: NDKEvent;

    let currentNpub;
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

        console.log(event);

        const newListEvent = new NDKEvent($ndk, {
            kind: 30001,
            tags: [
                ['d', newListName ],
                event.tagReference(),
            ],
        } as NostrEvent);
        await newListEvent.publish();
        closeModal();

        newListName = '';
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
        <h2 class="text-zinc-500 font-semibold text-base uppercase">BOOKMARK</h2>

        <ul class="
            rounded-lg
            divide-y divide-zinc-200
            border border-zinc-300
            overflow-y-auto
            w-full
            bg-white
            max-h-96
        ">
            {#each $sortedLists as list}
                <li>
                    <button class="
                        p-3 truncate
                        hover:bg-zinc-100
                        w-full
                        text-left
                    " on:click={()=>{addToList(list)}}>{list.name}</button>
                </li>
            {/each}
        </ul>

        <div class="flex flex-row">
            <Input type="text" klass="
                w-2/3 rounded-l-lg
            " placeholder="New List" bind:value={newListName} />

            <button class="
                bg-orange-500 hover:bg-orange-400 transition duration-300
                text-white font-semibold
                rounded-r-md w-1/3
                -ml-2
            " on:click={createNewList}>
                New List
            </button>
        </div>
    </div>
</ModalWrapper>
