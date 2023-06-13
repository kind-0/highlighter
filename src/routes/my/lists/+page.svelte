<script lang="ts">
    import ndk, { type NDKEventStore } from "$lib/stores/ndk";

    import NewIcon from '$lib/icons/New.svelte';

    import ToolbarButton from '../components/toolbar/button.svelte';
    import ListCard from '$lib/components/lists/ListCard.svelte';

    import NewListModal from '$lib/modals/lists/New.svelte'

    import { openModal } from 'svelte-modals'

    import { onDestroy } from 'svelte';
    import type NDKList from "$lib/ndk-kinds/lists";
    import { NDKListKinds } from "$lib/ndk-kinds";
    import { currentUser } from "$lib/store";


    let lists: NDKEventStore<NDKList>;

    $: if (!lists && $currentUser) {
        lists = $ndk.storeSubscribe({
            kinds: NDKListKinds as number[],
            authors: [$currentUser.hexpubkey()]
        }, { closeOnEose: false });
    }

    onDestroy(() => {
        if (lists) lists.unsubscribe();
    });

    let openMenu = false;
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-row justify-end relative">
        <ToolbarButton on:click={() => {openMenu = !openMenu}}>
            <NewIcon />
            Create new
        </ToolbarButton>
        {#if openMenu}
            <div class=" bg-white flex font-semibold text-sm flex-col absolute rounded-xl shadow-lg mt-10 border border-zinc-400">
                <a href="/my/lists/people/new" class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2 rounded-t-xl
                ">Profile List</a>

                <button class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2
                " on:click={() => { openModal(NewListModal, {}) }}>Generic List</button>

                <button class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2 rounded-b-xl
                " on:click={() => { openModal(NewListModal, { kind: 30022 }) }}>Relay List</button>
            </div>
        {/if}
    </div>

    <div class="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 gap-4">
        {#each $lists??[] as list}
            <div>
                <ListCard {list} />
            </div>
        {/each}
    </div>
</div>