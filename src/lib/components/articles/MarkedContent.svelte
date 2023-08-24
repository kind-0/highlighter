    <script lang="ts">
    import CardContent from '$lib/components/events/content.svelte';
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from "svelte";
    import { debounce } from 'throttle-debounce';

    const dispatch = createEventDispatcher();

    export let content: string;
    export let highlights: NDKHighlight[];
    export let tags: NDKTag[];
    export let addNewLines: boolean;
    export let unmarkedContent: string;
    export let renderAsHtml = false;

    function markText(highlight: NDKHighlight, htmlText: string) {
        const hContent = highlight.content.trim();

        // Split the plain text into words
        let words = hContent.split(/ /);


        // remove from words non alphanumeric characters
        words = words.map(w => w.replace(/[^a-zA-Z0-9]/g, '.*'));

        // Create a regex pattern that matches the words with any characters in between
        let pattern = words.join('.*');

        // Create a RegExp object from the pattern
        let regex = new RegExp(pattern, 'i');

        // Wrap the matched text in <mark> tags
        return htmlText.replace(regex, (match) => `<mark id=${highlight.id} data-highlight-id="${highlight.id}">${match}</mark>`);
    }

    let replacedHighlights: Record<string, boolean> = {};

    function markContent() {
        markedHighlightCount = highlights.length;
        content = unmarkedContent;

        if (!content) return;

        // remove from content breaklines and other control characters
        content = content.replace(/[\n\r\t]/g, ' ');


        for (const highlight of highlights) {
            if (!highlight.content) continue; // ignore highlights without content
            if (highlight.content.length < 2) continue; // ignore single character highlights
            if (replacedHighlights[highlight.id!]) continue;

            // check if highlight is in the content
            if (content.includes(highlight.content)) {
                content = content.replace(highlight.content, `<mark id=${highlight.id} data-highlight-id="${highlight.id}">${highlight.content}</mark>`);
                replacedHighlights[highlight.id!] = true;
            } else {
                // highlight is not in the content, try to find it
                console.log('could not find highlight 1', highlight.content, highlight.rawEvent());
                content = markText(highlight, content);
            }

            // check if highlight id is in the content
            if (!content.includes(highlight.id!)) {
                console.log('could not find highlight id 2', highlight.id, highlight.rawEvent());
                const hContent = highlight.content.trim();

                if (hContent.includes('\n')) {
                    const parts = hContent.split('\n');
                    const firstMeaningfulPart = parts.find(p => p.length > 2);
                    const lastMeaningfulPart = parts.reverse().find(p => p.length > 2);

                    if (firstMeaningfulPart && lastMeaningfulPart) {
                        const firstPartIndex = content.indexOf(firstMeaningfulPart);
                        const lastPartIndex = content.lastIndexOf(lastMeaningfulPart);

                        if (firstPartIndex !== -1 && lastPartIndex !== -1) {
                            const before = content.slice(0, firstPartIndex);
                            const after = content.slice(lastPartIndex + lastMeaningfulPart.length);

                            content = `${before}<mark id=${highlight.id} data-highlight-id="${highlight.id}">${hContent}</mark>${after}`;
                            replacedHighlights[highlight.id!] = true;
                        } else {
                            console.log('could not find meaningful parts', parts);
                        }
                    } else {
                        console.log('could not find meaningful parts', parts);
                    }
                }
            }
        }
    }

    let markedHighlightCount = 0;

    const debouncedMarkContent = debounce(100, markContent);

    $: if (highlights.length !== markedHighlightCount) {
        debouncedMarkContent();
    }

    function clickHandler(e: MouseEvent) {
        const target = e.target as HTMLElement;

        // if target is a mark with data-highlight-id emit an event
        if (target.dataset.highlightId) {
            const id = target.dataset.highlightId;
            const highlight = highlights.find(h => h.id === id);

            if (highlight) {
                dispatch('highlight-clicked', highlight);
            }
        }
    }
</script>

<div on:click={clickHandler}>
    {#if renderAsHtml}
        {@html content}
    {:else}
        <CardContent
            note={content??""}
            {tags}
            {addNewLines}
        />
    {/if}
</div>
