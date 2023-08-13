<script lang="ts">
    import { NDKListKinds } from '$lib/ndk-kinds';
    import { sortedListWithKind } from '$lib/stores/list';
    import { NDKList } from '@nostr-dev-kit/ndk';
    import MenuItem from '../sidebars/MenuItem.svelte';
    import Input from '../Input.svelte';
    import { Plus } from 'phosphor-svelte';
    import ndk from '$lib/stores/ndk';

    export let kinds: number[] = NDKListKinds;
    export let newListKind: number;
    export let selectedLists: Set<NDKList> = new Set();

    export let selectedItem: NDKList | undefined;
    export let singleItem: boolean;

    const lists = sortedListWithKind(kinds);

    function toggleItem(list: NDKList) {
        if (singleItem) {
            selectedLists = new Set();
            selectedItem = list;
        }

        if (selectedLists.has(list)) {
            selectedLists.delete(list);
        } else {
            selectedLists.add(list);
        }
        selectedLists = selectedLists;
    }

    async function addToNewList(name: string) {
        const list = new NDKList($ndk);
        list.name = name;
        list.kind = newListKind;
        list.publish().then(() => {
            toggleItem(list);
        });
        search = '';
    }

    let search: string = '';
</script>

{#if $lists}
    <div class="dropdown dropdown-start {$$props.dropdownClass}">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label tabindex="0" class="btn m-1 {$$props.class??''}">
            <slot />
        </label>
        <div class="menu overflow-x-hidden z-[1] p-2 shadow rounded-box bg-base-300 overflow-y-auto max-h-96 dropdown-content ">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul tabindex="0" class="">
                    <Input
                        placeholder="Search or create new list"
                        autofocus={true}
                        bind:value={search}
                    />
                {#each $lists as list}
                    {#if !search?.length || list.name?.toLowerCase().includes(search?.toLowerCase())}
                        <MenuItem
                            on:click={(e) => { e.preventDefault(); toggleItem(list); }}
                            active={selectedLists.has(list)}
                        >
                            {list.name}
                        </MenuItem>
                    {/if}
                {/each}

                {#if search?.length > 0}
                    <MenuItem
                        on:click={(e) => { e.preventDefault(); addToNewList(search); }}
                        active={false}
                    >
                        <div class="flex flex-row items-center py-1.5">
                            <Plus class="w-4 h-4 text-accent2 mr-2" />
                            Create "{search}"
                        </div>
                    </MenuItem>
                {/if}
            </ul>
        </div>
    </div>
{/if}