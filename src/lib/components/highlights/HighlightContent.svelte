<script lang="ts">
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import type NDKLongForm from "$lib/ndk-kinds/long-form";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import NoteContent from '$lib/components/events/content.svelte';

    export let highlight: NDKHighlight;
    export let article: NDKLongForm | NDKEvent | string | undefined = undefined;
    export let expandedContext: boolean = true;

    let highlightedId: string;
    let floatedHighlightBorder: boolean = false;

    let contextWithHighlight = '';

    $: if (article?.content && highlightedId !== article.id) {
        highlightedId = article.id;

        try {
            if (expandedContext && article && article.content?.length < 2000) {
                floatedHighlightBorder = true;
                contextWithHighlight = article.content.replace(highlight.content, `<span class='mark-wrapper'><span class="mark-wrapper-inner"></span><mark>${highlight.content}</mark></span>`);
            }
        } catch (e) {
            console.trace(highlight);
            console.error(e);
        }
    }

    $: if (highlight.content !== highlightedId && !article?.content) {
        highlightedId = highlight.id;

        if (highlight.context) {
            contextWithHighlight = highlight.context.replace(highlight.content, `<mark>${highlight.content}</mark>`);
        } else {
            contextWithHighlight = `<mark>${highlight.content}</mark>`;
        }
    }
</script>

<div class="pl-4 py-4 relative
    {floatedHighlightBorder ? '' : 'border-l-4 border-orange-300'}
">
    <NoteContent note={contextWithHighlight} tags={(article??highlight).tags} />
</div>

<style>
    :global(.mark-wrapper) {
        padding: 0 0.125rem;
    }

    :global(.mark-wrapper-inner) {
        z-index: 9999;
        position: absolute;
        margin-top: -10px;
        left: 0;
        @apply border-l-4 border-orange-300;
        width: 10px;
        height: 50px;
    }
</style>