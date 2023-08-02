<script lang="ts">
    import ArticleEditor from "$lib/components/articles/editor/ArticleEditor.svelte";
    import type NDKLongForm from "$lib/ndk-kinds/long-form";
    import { page } from '$app/stores';
    import { longFormStore } from "$lib/stores/long-form";

    const { naddr } = $page.params;

    let event: NDKLongForm | undefined;

    $: if (!event) event = $longFormStore.get(naddr);
</script>

{#if event}
    <ArticleEditor bind:event />
{:else}
    <p>Event not found</p>
{/if}
