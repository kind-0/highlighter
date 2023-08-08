<script lang="ts">
    import ArticleEditor from "$lib/components/articles/editor/ArticleEditor.svelte";
    import type NDKArticle from "@nostr-dev-kit/ndk";
    import { page } from '$app/stores';
    import { longFormStore } from "$lib/stores/long-form";

    const { naddr } = $page.params;

    let event: NDKArticle | undefined;

    $: if (!event) event = $longFormStore.get(naddr);
</script>

{#if event}
    <ArticleEditor bind:event />
{:else}
    <p>Event not found</p>
{/if}
