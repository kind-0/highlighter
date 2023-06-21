<script lang="ts">
    // This component displays a card for an article in a style
    // that would work within a list of articles.

	import type NDKLongForm from '$lib/ndk-kinds/long-form';

    import ArticlePreview from '../editor/ArticlePreview.svelte';
    import { createDraggableEvent } from '$lib/utils/draggable';

    export let article: NDKLongForm;

    function articleLink() {
        return `/my/notes/${article.encode()}`;
    }

    const draggable = createDraggableEvent(article);
</script>

<div use:draggable>
    <ArticlePreview
        href={articleLink()}
        title={article.title??''}
        body={article.summary??article.content}
        tags={article.tags}
        image={article.image}
        class="md:px-6 md:py-6 {$$props.class??""}"
        titleClass="md:text-xl font-bold"
    />
</div>