<script lang="ts">
    import HighlightCard from '$lib/components/highlights/card.svelte';
    import NoteCard from '$lib/components/notes/card.svelte';
    import { handleEvent1 } from '$lib/interfaces/notes';
    import { handleEvent9802 } from '$lib/interfaces/highlights';
    import ndk from '$lib/stores/ndk';
    import { nip19 } from 'nostr-tools';
    import { createEventDispatcher } from 'svelte';
    import type { NDKEvent, NDKFilter, NDKTag } from '@nostr-dev-kit/ndk';
    import { filterForId } from '$lib/utils';
    import { currentUser } from '$lib/store';
    import { Card, CardPlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte'

    export let tag: NDKTag | undefined = undefined;
    export let id: string | undefined = undefined;
    export let skipReplies: boolean = false;
    export let skipFooter: boolean = false;
    export let event: NDKEvent | undefined = undefined;
    export let popoverButtons: boolean = false;

    const dispatcher = createEventDispatcher();

    let filter: NDKFilter | undefined = undefined;

    if (tag) {
        filter = filterForId(tag[1]);
    }

    async function loadEvent(): Promise<NDKEvent | undefined> {
        if (event) return event;

        const p: Promise<NDKEvent | undefined> = new Promise((resolve, reject) => {
            if (!id && !filter) {
                throw new Error(`no id or filter`);
            }

            $ndk.fetchEvent(filter || id).then((e) => {
                if (!e) return reject(`no event ${JSON.stringify(filter)}`);

                if (e.kind === 4) {
                    console.log('decrypting')
                    setTimeout(async () => {
                        await e.decrypt($currentUser!);
                        resolve(e);
                    }, 1000 * Math.random())
                } else {
                    setTimeout(() => {resolve(e)}, 1000 * Math.random());
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

{#await loadEvent()}
    <Card size="full">
        <div role="status" class="max-w-lg animate-pulse my-8"><div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-4"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-9/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-10/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-11/12 mb-2.5"></div> <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-9/12"></div> <span class="sr-only">Loading...</span></div>
    </Card>
{:then e}
    {#if e}
        <div
            draggable={true}
            on:dragstart={(dragEvent) => dragStart(dragEvent, e)}
        >
            {#if e.kind === 9802}
                <div class="border rounded-lg border-zinc-300">
                    <HighlightCard
                        highlight={handleEvent9802(e)}
                        skipTitle={true}
                        {popoverButtons}
                    />
                </div>
            {:else if e.kind === 1}
                <NoteCard
                    note={handleEvent1(e)}
                    {skipReplies}
                    {skipFooter}
                    {popoverButtons}
                />
            {:else if e.kind === 4}
                <NoteCard
                    note={handleEvent1(e)}
                    {skipReplies}
                    {skipFooter}
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