<script lang="ts">
    import type NDKLongForm from "$lib/ndk-kinds/long-form";

    import { page } from '$app/stores';
    import ToolbarButton from '../../components/toolbar/button.svelte';
    import ArticlePreview from "$lib/components/articles/editor/ArticlePreview.svelte";

    import { longFormStore } from "$lib/stores/long-form";

    const { naddr } = $page.params;

    let event: NDKLongForm | undefined

    $: if (!event) event = $longFormStore.get(naddr);
</script>

{#if event}
    <div class="flex flex-row justify-end">
        <ToolbarButton href={`/my/notes/${naddr}/edit`} class="px-8">
            Edit
        </ToolbarButton>
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