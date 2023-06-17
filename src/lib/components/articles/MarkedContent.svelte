<script lang="ts">
    import CardContent from '$lib/components/events/content.svelte';
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import type { NDKTag } from '@nostr-dev-kit/ndk';

    export let content: string;
    export let highlights: NDKHighlight[];
    export let tags: NDKTag[];
    export let addNewLines: boolean;
    export let unmarkedContent: string;

    function markContent() {
        content = unmarkedContent;

        if (!content) return;

        for (const highlight of highlights) {
            if (!highlight.content) continue;
            // if (replacedHighlights[highlight.id!]) continue;
            content = content.replace(highlight.content, `<mark data-highlight-id="${highlight.id}">${highlight.content}</mark>`);
            // replacedHighlights[highlight.id!] = true;
        }
    }

    let markedHighlightCount = 0;

    $: if (highlights.length !== markedHighlightCount) {
        markContent();
        markedHighlightCount = highlights.length;
    }
</script>

<CardContent
    note={content??""}
    {tags}
    {addNewLines}
/>