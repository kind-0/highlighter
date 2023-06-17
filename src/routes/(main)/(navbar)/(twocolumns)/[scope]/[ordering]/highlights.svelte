<script lang="ts">
    import ArticleCardWithHighlights from "$lib/components/articles/cards/ArticleCardWithHighlights.svelte";
    import { throttle } from "throttle-debounce";
    import { articleHighlights } from "$lib/stores/highlights";

    let renderedArticleIds: string[] = [];

    const throttledRenderArticles = throttle(100, () => {
        const entries = Array.from($articleHighlights.entries());
        const sortedHighlights = Array.from(entries).sort(
            (a, b) => b[1].length - a[1].length
        );
        const topTenArticles = sortedHighlights.slice(0, 10);

        renderedArticleIds = topTenArticles.map((a) => a[0]);
    });

    $: if ($articleHighlights) {
        throttledRenderArticles();
    }
</script>

<div class="flex flex-col gap-8 w-full">
    {#each renderedArticleIds as articleId (articleId)}
        <ArticleCardWithHighlights
            highlights={$articleHighlights.get(articleId)}
        />
    {/each}
</div>