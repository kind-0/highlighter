<script lang="ts">
    import { currentScope } from "$lib/store";
    import ArticleCardWithHighlights from "$lib/components/articles/cards/ArticleCardWithHighlights.svelte";
    import { onDestroy, onMount } from "svelte";
    import type { NDKEventStore } from "$lib/stores/ndk";
    import ndk from "$lib/stores/ndk";
    import NDKHighlight from "$lib/ndk-kinds/highlight";
    import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
    import type NDKLongForm from "$lib/ndk-kinds/long-form";
    import { throttle } from "throttle-debounce";

    /**
     * Whether to skip showing the user who did the highlight
     */
    export let skipHighlighter: boolean = false;

    /**
     * Maximum number of highlights to show by default on each article card
     */
    export let maxHighlightCountToShow: number | undefined = undefined;
    export let scope: string | undefined = undefined;
    export let pubkey: string | undefined = undefined;

    let prevScope: string;
    let pubkeys: string[] | undefined = undefined;

    $: if (scope !== prevScope && scope && prevScope && highlights) {
        prevScope = scope;
        switch (scope) {
            case "personal":
                if (!pubkey) throw new Error('pubkey is required for scope "pubkey"');
                pubkeys = [pubkey];
                break;
            default:
                pubkeys = $currentScope.pubkeys;
        }
        console.log("loading articles !!")
        loadArticlesGroupedByHighlights({ authors: pubkeys });
    }

    let highlights: NDKEventStore<NDKHighlight>;
    let taggedEventIds: string[] = [];
    onMount(() => {
        prevScope = scope!;
        const opts: NDKFilter = {};
        if (pubkeys && pubkeys.length > 0) {
            opts.authors = pubkeys;
        }
        console.log("loading articles !!")
        loadArticlesGroupedByHighlights(opts);
    });

    onDestroy(() => {
        highlights?.unsubscribe();
    });

    let activeFilter: any;
    let toSort = false

    async function loadArticlesGroupedByHighlights(filter: any = {}) {
        highlights?.unsubscribe();
        const oneMonthAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
        filter = {
            limit: 500,
            kinds: [9802],
            ...filter,
        };
        console.log({ filter });
        activeFilter = filter;
        highlights = $ndk.storeSubscribe<NDKHighlight>(
            filter,
            { closeOnEose: true },
            NDKHighlight
        );
    }

    let processedHighlightCount = 0;
    let processedHighlightIds: Set<string> = new Set();
    let renderTaggedEvents: Record<string, NDKHighlight[]> = {};

    $: if ($highlights && $highlights?.length !== processedHighlightCount) {
        updateTaggedEventIds();
    }

    let maxHighlightCount = 0

    function updateTaggedEventIds() {
        processedHighlightCount = $highlights?.length ?? 0;

        for (const highlight of $highlights ?? []) {

            // track all highlights that have already been counted
            if (processedHighlightIds.has(highlight.id)) continue;
            processedHighlightIds.add(highlight.id);

            // get what article has been tagged
            const tag = highlight.getArticleTag();
            if (!tag) continue;

            const articleId: ArticleId = tag[1];

            if (!groupedHighlights[articleId]) {
                groupedHighlights[articleId] = [];
            }

            groupedHighlights[articleId].push(highlight);
        }
        sortArticles();
    }

    type ArticleId = string;
    let groupedHighlights: Record<ArticleId, NDKHighlight[]> = {};
    let renderedArticleIdSignature: string;
    let renderedArticleIds: ArticleId[] = [];

    const throttledRender = throttle(1000, render);

    function render(selectedGroupedHighlights: ArticleId[]) {
        const incomingArticleIds = selectedGroupedHighlights.join();
        if (incomingArticleIds === renderedArticleIdSignature) return;

        renderedArticleIds = selectedGroupedHighlights;
    }

    function sortArticles() {
        const sortedArticleWithCount = Object.entries(groupedHighlights)
            .map(([articleId, highlights]) => [articleId, highlights.length] as [string, number])
            .sort((a, b) => b[1] - a[1]);

        throttledRender(sortedArticleWithCount.slice(0, 10).map(([articleId, _]) => articleId));
    }
</script>

<div class="flex flex-col gap-8">
    {#each renderedArticleIds as articleId (articleId)}
        <ArticleCardWithHighlights
            {articleId}
        />
    {/each}
</div>
