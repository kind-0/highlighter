<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

    import { closeModal } from 'svelte-modals';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import Input from '$lib/components/Input.svelte';
    import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';
    import { lists } from '$lib/stores/list';

    export let event: NDKEvent;

    let currentNpub;
    let newListName: string;

    async function addToList(list: NDKList) {
        const event = new NDKEvent($ndk, JSON.parse(list.event));

        // check if event is already in list
        const [a,b] = event.tagReference();
        if (event.tags.find((tag) => tag[0] === a && tag[1] === b)) {
            event.tags.filter((tag) => tag[0] !== a && tag[1] !== b);
            await event.publish();
            closeModal();
            return;
        }

        event.tags.push(event.tagReference());
        await event.publish();
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

<ModalWrapper klass="max-w-sm">
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
            max-h-96
        ">
            {#each $lists as list}
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

        <div class="flex flex-row gap-2">
            <Input type="text" klass="
                w-2/3
            " placeholder="New List" bind:value={newListName} />

            <RoundedButton class="
                rounded-lg w-1/3
            " on:click={createNewList}>
                Create
            </RoundedButton>
        </div>
    </div>
</ModalWrapper>
