<script lang="ts">
    import HighlightCard from '$lib/components/highlights/HighlightCard.svelte';

    import Avatar from '$lib/components/Avatar.svelte';

    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import NoteCard from '$lib/components/notes/card.svelte';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';

    export let highlight: NDKHighlight;
    export let skipTitle: boolean = false;
    export let skipButtons: boolean = false;
    export let disableClick: boolean = false;
    export let collapsedQuotes: boolean = true;

    /**
     * When the tagged event allows (e.g. kind:1) expand the context
     * to be the full tagged event instead of the context embedded in the highlight.
     */
    export let expandedContext: boolean = true;
    let prevHighlightId: string | undefined = undefined;

    let replies;
    let quotes: NDKEventStore<NDKEvent>;
    let pubkey: string;
    let showComments = false;
    let showReplies = false;
    let highlightNoteId = '';
    let niceTime: string;
    let quotePubkeys: string[] = [];

    // Set the quote pubkeys
    $: if ($quotes && $quotes.length > 0 && quotes.length != quotePubkeys.length) {
        quotePubkeys = $quotes.map((q: NDKEvent) => q.pubkey);
    }

    // replies = $ndk.storeSubscribe({ '#e': [highlight.id] }, { closeOnEose: false });
    quotes = $ndk.storeSubscribe({ kinds: [1], '#q': [highlight.id] }, { closeOnEose: true, groupableDelay: 200 });

    // $: {
    //     if (prevHighlightId !== highlight.id && highlight.id) {
    //         showComments = false;
    //         showReplies = false;
    //         prevHighlightId = highlight.id;
    //         niceTime = new Date(highlight.timestamp * 1000).toLocaleString();

    //         highlightNoteId = nip19.noteEncode(highlight.id);

    //         const pubkeyFilter: ILoadOpts = {};

    //         if ($currentScope.pubkeys) {
    //             pubkeyFilter.pubkeys = $currentScope.pubkeys;
    //         }

    //         replies = NoteInterface.load({ replies: [highlight.id], ...pubkeyFilter });
    //         quotes = NoteInterface.load({ quotes: [highlight.id], ...pubkeyFilter });
    //     }

    //     if (!event || event.id !== highlight.id) {
    //         try {
    //             event = new NDKHighlight($ndk, JSON.parse(highlight.event));
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }

    //     pubkey = highlight.pubkey;
    // }

    function shouldDisplayQuote(highlight: NDKHighlight, quotes: NDKEvent[]) {
        if (!quotes || quotes.length !== 1) {
            return true;
        }

        return false;
    }
</script>

<code>HighlightListItem</code>
<div class="
    flex flex-col
    {collapsedQuotes? '' : 'gap-8'}
">
    {#if shouldDisplayQuote(highlight, $quotes||[])}
        <div class="text-lg">
            {#await highlight.article then article}
                <code>HighlightCard</code>
                <HighlightCard
                    {highlight}
                    {article}
                    {expandedContext}
                    {skipButtons}
                    {skipTitle}
                    {disableClick}
                />
            {/await}
        </div>

        {#if ($quotes||[]).length > 0}
            {#if collapsedQuotes}
                <div class="px-8 py-3">
                    <div class="flex flex-row gap-2 items-center">
                        <div class="isolate flex -space-x-2 overflow-hidden">
                            {#each Array.from(new Set(quotePubkeys)).slice(0, 6) as quotePubkey}
                                <div class="relative z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white">
                                    <Avatar pubkey={quotePubkey} />
                                </div>
                            {/each}
                        </div>

                        <button
                            class="text-xs font-medium text-zinc-600 hover:text-zinc-500"
                            on:click={() => { collapsedQuotes = false }}>
                            Show {$quotes?.length} notes...
                        </button>
                    </div>
                </div>
            {:else}
                <div class="ml-6 flex flex-col gap-6 quote-card">
                    {#each ($quotes||[]) as quote}
                        <div class="text-lg">
                            <NoteCard event={quote} />
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    {:else}
        {#each ($quotes||[]) as quote}
            <div class="text-lg">
                <NoteCard event={quote} />
            </div>
        {/each}
    {/if}
</div>
