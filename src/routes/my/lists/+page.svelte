<script lang="ts">
    import NewIcon from '$lib/icons/New.svelte';

    import ToolbarButton from '../components/toolbar/button.svelte';
    import ListCard from '$lib/components/lists/ListCard.svelte';

    import NewListModal from '$lib/modals/lists/New.svelte';

    import { openModal } from 'svelte-modals'
    import { lists } from "$lib/stores/list";

    import { derived } from 'svelte/store';
    import type NDKList from '$lib/ndk-kinds/lists';

    let openMenu = false;

    const namedLists = derived(lists, ($lists) => {
        const namedLists: NDKList[] = [];

        for (const list of $lists.values()) {
            if (!!list.tagValue('name')) namedLists.push(list);
        }

        // sort by created_at
        namedLists.sort((a, b) => b.created_at - a.created_at);

        return namedLists;
    });

    const unnamedLists = derived(lists, ($lists) => {
        const unnamedLists: NDKList[] = [];

        for (const list of $lists.values()) {
            if (!list.tagValue('name')) unnamedLists.push(list);
        }

        unnamedLists.sort((a, b) => b.created_at - a.created_at);

        return unnamedLists;
    });
</script>

<svelte:head>
    <title>Lists | HIGHLIGHTER.com</title>
</svelte:head>

<div class="flex flex-col gap-8">
    <div class="flex flex-row justify-end relative">
        <ToolbarButton
            on:click={() => {
                openMenu = !openMenu;
            }}
        >
            <NewIcon />
            Create new
        </ToolbarButton>
        {#if openMenu}
            <div class="
                bg-white flex font-semibold text-sm flex-col
                absolute rounded-xl shadow-lg mt-10 border border-zinc-400
            ">
                <a href="/my/lists/people/new" class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2 rounded-t-xl
                ">Profile List</a
                >

                <button
                    class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2
                "
                    on:click={() => {
                        openModal(NewListModal, {});
                    }}>Generic List</button
                >

                <button
                    class="
                    text-zinc-500 hover:text-white
                    text-left
                    bg-white hover:bg-orange-600
                    px-4 py-2 rounded-b-xl
                "
                    on:click={() => {
                        openModal(NewListModal, { kind: 30022 });
                    }}>Relay List</button
                >
            </div>
        {/if}
    </div>

    <div class="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

        {#each $namedLists??[] as list (list.id)}
          
                <ListCard {list} />
            
        {/each}
    </div>

    <hr>

    <div class="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {#each $unnamedLists??[] as list (list.id)}
            <div>
                <ListCard {list} />
            </div>
        {/each}
    </div>
</div>
