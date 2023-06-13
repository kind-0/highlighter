<script lang="ts">
    import AvatarWithName from "$lib/components/AvatarWithName.svelte";
    import Avatar from "$lib/components/Avatar.svelte";
    import InlineHighlight from "$lib/components/highlights/inline.svelte";
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import NDKLongForm from "$lib/ndk-kinds/long-form";

    export let highlights: NDKHighlight[];

    /**
     * List of pubkeys to display highlights from
     */
    export let highlightsFrom: string[] | undefined = undefined;

    /**
     * Maximum number of highlights to show by default
     */
    export let maxHighlightCountToShow = 1;

    /**
     * Whether to skip showing the user who did the highlight
     */
    export let skipHighlighter: boolean = false;

    // let note: Observable<App.Note[]> | undefined;
    // let article: Observable<App.Article[]> | undefined;
    // let articleHighlights: Observable<App.Highlight[]> | undefined;

    let highlightPubkeys: Set<string> = new Set();

        // articleHighlights = HighlightInterface.loadByArticleIdAndPubkeys(
        //     id,
        //     highlightsFrom,
        //     {limit: 500}
        // );

    // $: if ($article && $article?.length > 0 && !articleEvent) {
    //     articleEvent = new NDKEvent($ndk, JSON.parse(article.event));
    // }

    // $: if (highlights && highlights?.length > 0) {
    //     for (const highlight of highlights) {
    //         highlightPubkeys.add(highlight.pubkey);
    //     }
    // }

    // function linkTo(article?: App.Article, note?: App.Note) {
    //     if (article) {
    //         return `/a/${articleEvent.encode()}`;
    //     } else if (note) {
    //         return `/a/${nip19.noteEncode(note.id)}`;
    //     }
    // }

    function articleUrl(article) {
        if (article instanceof NDKEvent) {
            return `/a/${article.encode()}`;
        } else if (typeof article === 'string') {
            return `/load?url=${encodeURIComponent(article)}`;
        } else {
            throw new Error('Invalid article type');
        }
    }

    function articleTitle(article) {
        if (article instanceof NDKLongForm) {
            return article.title;
        } else if (typeof article === 'string') {
            return article;
        } else {
            return "Untitled";
        }
    }
</script>

{#await highlights[0].getArticle() then article}
    <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center gap-4 justify-between">
            <a href={articleUrl(article)}
                class="text-xl font-semibold whitespace-nowrap">
                {articleTitle(article)} 
            </a>
            <div class="flex flex-row items-center gap-2 overflow-auto">
                <!-- {#each (article.tags||[]).slice(0, 3) as tag}
                <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {tag}
                </span>
                {/each} -->
            </div>
        </div>

        {#if article instanceof NDKEvent}
            <AvatarWithName pubkey={article.author.hexpubkey()} />
        {/if}
    </div>

    <div class="ml-6">
        <ul class="flex flex-col gap-4 divide-y divide-gray-200">
            {#each highlights.slice(0, maxHighlightCountToShow) as highlight}
                <InlineHighlight
                    {highlight}
                    {skipHighlighter}
                    url={articleUrl(article)}
                />
            {/each}
        </ul>
    </div>

    <div class="bg-zinc-50 -mx-8 -mb-4 px-8 py-3 flex flex-row items-center justify-between">
        {#if highlights.length > maxHighlightCountToShow}
            <div class="flex flex-row gap-2 items-center">
                <div class="isolate flex -space-x-2 overflow-hidden">
                    {#each Array.from(highlightPubkeys).slice(0, 3) as highlightPubkey}
                        <div class="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white">
                            <Avatar pubkey={highlightPubkey} />
                        </div>
                    {/each}
                </div>

                <button
                    class="text-xs font-medium text-zinc-600 hover:text-zinc-500"
                    on:click={() => { maxHighlightCountToShow += 5 }}>
                    {highlights.length-maxHighlightCountToShow} more highlights...
                </button>
            </div>
        {:else}
            <div></div>
        {/if}

        <a class="
            text-sm
            text-zinc-600 font-semibold
        ">
            View article →
        </a>
    </div>
{/await}