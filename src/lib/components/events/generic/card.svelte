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
    import ListCard from '$lib/components/lists/ListCard.svelte';
    import ArticleIntroCard from '$lib/components/articles/cards/ArticleIntroCard.svelte';
    import NDKLongForm from '$lib/ndk-kinds/long-form';

    export let bech32: string | undefined = undefined;
    export let id: string | undefined = undefined;
    export let skipReplies: boolean = false;
    export let skipTitle: boolean | undefined = undefined;
    export let skipFooter: boolean = false;
    export let expandReplies: boolean = true;
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

                dispatcher('eventLoad', e);
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
                class="w-full"
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
                        event={e}
                        {skipReplies}
                        {skipFooter}
                        {expandReplies}
                    />
                {:else if e.kind === 4}
                    <NoteCard
                        event={e}
                        {skipReplies}
                        {skipFooter}
                        {expandReplies}
                    />
                {:else if e.kind >= 30000 && e.kind < 30022}
                    <ListCard list={NDKList.from(e)} />
                {:else if e.kind === 9735}
                    <ZapEventCard
                        event={e}
                    />
                {:else if e.kind === 31023}
                    <ArticleIntroCard
                        article={NDKLongForm.from(e)}
                    />
                {:else if e.kind >= 30000 && e.kind < 40000}
                    <Card size="xl">
                        <div class="text-left">
                            <Name ndk={$ndk} pubkey={e.pubkey} />'s
                            {e.kind} "{e.tagValue('d')}"
                        </div>
                    </Card>
                {:else}
                    <Card size="xl">
                        <div class="text-center">
                            Event kind {e.kind} not supported yet
                        </div>
                    </Card>
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