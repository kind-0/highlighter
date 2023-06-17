<script lang="ts">
    import HighlightCard from '$lib/components/highlights/HighlightCard.svelte';
    import NoteCard from '$lib/components/notes/card.svelte';
    import { getContext } from 'svelte';
    import ndk from '$lib/stores/ndk';
    import { createEventDispatcher } from 'svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';
    import { Card } from 'flowbite-svelte'
    import NDKList from '$lib/ndk-kinds/lists';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';
    import NDKHighlight from '$lib/ndk-kinds/highlight';
    import { filterForId, filterFromNaddr } from '$lib/utils';
    import ZapEventCard from '$lib/components/zaps/ZapEventCard.svelte';

    export let bech32: string | undefined = undefined;
    export let id: string | undefined = undefined;
    export let skipReplies: boolean = false;
    export let skipTitle: boolean | undefined = undefined;
    export let skipFooter: boolean = false;
    export let event: NDKEvent | undefined = undefined;
    export let draggable = true;

    const dispatcher = createEventDispatcher();

    async function decryptWithRetry(event: NDKEvent, resolve: (e: NDKEvent) => void) {
        try {
            await event.decrypt($currentUser!);
            resolve(event);
        } catch (e) {
            setTimeout(() => decryptWithRetry(event, resolve), 1000 * Math.random());
        }
    }

    async function loadEvent(): Promise<NDKEvent | undefined> {
        if (event) return event;

        const p: Promise<NDKEvent | undefined> = new Promise((resolve, reject) => {
            if (!id && !bech32) {
                throw new Error(`no id or bech32`);
            }

            let filter: NDKFilter;

            if (id) {
                filter = filterForId(id);
            } else if (bech32) {
                filter = filterFromNaddr(bech32);
            }

            $ndk.fetchEvent(filter).then((e) => {
                if (!e) return reject(`no event ${id}`);

                if (e.kind === 4) {
                    decryptWithRetry(e, resolve);
                } else {
                    resolve(e);
                }

                dispatcher('event:load', e);
            });
        });

        return p;
    }

    function dragStart(dragEvent: DragEvent, ndkEvent: NDKEvent) {
        if (!dragEvent.dataTransfer) return;

        const tag = ndkEvent.tagReference();

        dragEvent.dataTransfer.setData('id', ndkEvent.id as string);
        dragEvent.dataTransfer.setData('tag', JSON.stringify(tag));
    }
</script>

{#key id}
    {#await loadEvent()}
        <Card size="full">
            <div role="status" class="max-w-lg animate-pulse my-8"><div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-4"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-9/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-10/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-11/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-9/12"></div> <span class="sr-only">Loading...</span></div>
        </Card>
    {:then e}
        {#if e}
            <div
                {draggable}
                on:dragstart={(dragEvent) => dragStart(dragEvent, e)}
            >
                {#if e.kind === 9802}
                    <div class="border rounded-lg border-zinc-300">
                        {#await NDKHighlight.from(e).article then article}
                            <HighlightCard
                                highlight={NDKHighlight.from(e)}
                                {skipReplies}
                                {article}
                                skipTitle={skipTitle??getContext("skipTitle")??true}
                            />
                        {/await}
                    </div>
                {:else if e.kind === 1}
                    <NoteCard
                        {draggable}
                        event={e}
                        {skipReplies}
                        {skipFooter}
                    />
                {:else if e.kind === 4}
                    <NoteCard
                        event={e}
                        {skipReplies}
                        {skipFooter}
                    />
                {:else if e.kind >= 30000 && e.kind < 40000}
                    <a href="/my/lists/{e.encode()}" class="
                        shadow
                        flex flex-col h-full gap-4
                        border border-zinc-200 hover:border-zinc-200
                        px-6 pt-6 pb-4 rounded-xl
                        bg-white hover:bg-slate-50 transition duration-200 ease-in-out
                    " style="max-height: 40rem;">
                        <div class="flex-1 truncate px-4 py-2 text-sm">
                            <div class="text-lg font-medium text-gray-900 hover:text-gray-600">
                                <Name ndk={$ndk} pubkey={e.pubkey} />'s
                                {(new NDKList($ndk, e.rawEvent())).name} list
                            </div>
                        </div>
                    </a>
                {:else if e.kind === 9735}
                    <ZapEventCard
                        event={e}
                    />
                {/if}
            </div>
        {:else}
            @{id}
        {/if}
    {:catch e}
        <Card size="full">
            {e}
        </Card>
    {/await}
{/key}