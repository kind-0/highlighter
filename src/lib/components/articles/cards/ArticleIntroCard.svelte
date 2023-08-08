<script lang="ts">
    // This component displays a card for an article in a style
    // that would work within a list of articles.

	import type { NDKArticle } from "@nostr-dev-kit/ndk";

    import ArticlePreview from '../editor/ArticlePreview.svelte';
    import { createDraggableEvent } from '$lib/utils/draggable';

    export let article: NDKArticle;
    export let href: string | undefined = undefined;

    function articleLink() {
        return `/notes/${article.encode()}`;
    }

    const draggable = createDraggableEvent(article);
</script>

<div use:draggable>
    <ArticlePreview
        href={href??articleLink()}
        title={article.title??''}
        body={article.summary??article.content}
        tags={article.tags}
        image={article.image}
        class="{$$props.class??""}"
        titleClass="md:text-xl font-bold"
        naddr={article.encode()}
        {article}
    />
</div>