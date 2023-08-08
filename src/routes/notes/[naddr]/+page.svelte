<script lang="ts">
    import type NDKArticle from "@nostr-dev-kit/ndk";

    import { page } from '$app/stores';
    import ArticlePreview from "$lib/components/articles/editor/ArticlePreview.svelte";

    import { longFormStore } from "$lib/stores/long-form";

    const { naddr } = $page.params;

    let event: NDKArticle | undefined;

    $: if (!event) event = $longFormStore.get(naddr);
</script>

{#if event}
    <div class="flex flex-row justify-end">
        <a href={`/notes/${naddr}/edit`} class="btn btn-neutral">
            Edit
        </a>
    </div>

    <ArticlePreview
        title={event.title??""}
        body={event.content}
        tags={event.tags}
        article={event}
    />
{:else}
    <p>Event not found</p>
{/if}