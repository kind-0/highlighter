<script lang="ts">
    import NDKList from '$lib/ndk-kinds/lists';
    import Name from '$lib/components/Name.svelte';

    export let name: string;

    import ndk from '$lib/stores/ndk';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';
    import { onDestroy, onMount } from 'svelte';
    import Tags from './tags.svelte';
    import { currentUser } from '$lib/store';
    import Button from '$lib/components/buttons/Button.svelte';

    let subs: NDKSubscription[] = [];
    let lists: NDKList[] = [];
    let loadOffset = 10;

    onMount(async () => {
        const sub = $ndk.subscribe({ '#d': [name] });
        sub.on('event', (e) => {
            if (e.pubkey === $currentUser?.hexpubkey()) return;

            const list = new NDKList($ndk, e.rawEvent());

            if (list.items.length > 0) lists.push(list);
            lists = lists;
        });

        subs.push(sub);
    });

    onDestroy(() => {
        for (const sub of subs) {
            sub.stop();
        }
    })

    let expandedLists: Record<string, boolean> = {};
</script>

<div class="flex flex-col gap-4">
    {#each lists.slice(0, loadOffset) as list}
        <div class="flex flex-col gap-2">
            <div class="flex flex-row items-center justify-between text-lg font-semibold">
                <div class="truncate">
                    <Name pubkey={list.pubkey} />'s
                    {list.name}
                </div>

                <button
                    class="rounded-full p-1 bg-zinc-300 hover:bg-zinc-400 transition duration-200 ease-in-out"
                    on:click={() => expandedLists[list.id] = !!!expandedLists[list.id]}>
                    {#if expandedLists[list.id]}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    {:else}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    {/if}
                </button>
            </div>

            {#if expandedLists[list.id]}
                <Tags {list} tags={list.tags} />
            {/if}
        </div>
    {/each}

    {#if loadOffset < lists.length}
        <Button
            class="rounded-lg p-2 mt-4 bg-zinc-300"
            on:click={() => loadOffset += Math.max(10, loadOffset * 1.25)}
        >
            Load more
        </Button>
    {/if}
</div>

Showing {Math.min(lists.length, Math.floor(loadOffset))} of {lists.length} lists