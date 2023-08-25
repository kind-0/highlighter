<script lang="ts">
    import ArticleCard from '$components/Articles/ArticleCard.svelte';
    import { newArticles } from '$stores/articles';
    import type { NDKArticle } from '@nostr-dev-kit/ndk';
    import { onDestroy, onMount } from 'svelte';
    import { debounce } from 'throttle-debounce';
    import { createEventDispatcher } from "svelte";
    import ArticleContentCard from '$components/ContentCards/ArticleContentCard.svelte';

    export let items: NDKArticle[];
    export let articlesToRender = 8;
    export let expanded = false;

    const dispatch = createEventDispatcher();

    const updatedRenderedArticles = debounce(300, (newArticles: NDKArticle[]) => {
        items = newArticles.slice(0, articlesToRender);
    });

    $: if ($newArticles || articlesToRender) updatedRenderedArticles($newArticles);

    onMount(() => {
        newArticles.ref();
    })

    onDestroy(() => {
        newArticles.unref();
    });

    let loadedAuthors = 0;

    function authorLoaded() {
        loadedAuthors++;

        if (loadedAuthors === items.length) {
            dispatch('ready');
        }
    }
</script>

<br>

{#if items}
    <div class="
        {expanded ? "grid grid-flow-row grid-cols-2 md:grid-cols-3 max-h-[50vh] overflow-y-auto" : "grid grid-flow-col auto-cols-max"} gap-4">
        {#each items as article (article.id)}
            <ArticleContentCard {article} on:author-loaded={authorLoaded} />
        {/each}
    </div>
{/if}