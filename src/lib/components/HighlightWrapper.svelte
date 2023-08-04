<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';
    import { getText, getParagraph, getSentence } from 'get-selection-more'


    export let selection: string | undefined = undefined;

    let wrapperEl: HTMLDivElement;
    const dispatch = createEventDispatcher();

    let listener: any;

    let hasTouchInterface: boolean;

    onMount(() => {
        hasTouchInterface = !!('ontouchstart' in window || navigator.maxTouchPoints);

        listener = () => {
            // get the selection
            const sel = window.getSelection();
            if (!sel) return;
            try {
                var selectedRange = sel.getRangeAt(0);
                // get the text content of the selection
                selection = sel.toString();
                if (wrapperEl.contains(selectedRange.commonAncestorContainer)) {
                    const d = {
                        selection: getText(),
                        paragraph: getParagraph(),
                        sentence: getSentence(),
                    }

                    if (hasTouchInterface) {
                        // select the first word in the document
                        var range = document.createRange();
                        range.selectNodeContents(document.body);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    dispatch('selectionchange', d);
                }
            } catch (e) {}
        }

        if (hasTouchInterface) {
            document.addEventListener("touchend", listener);
        } else {
            document.addEventListener("selectionchange", listener);
        }
    })

    onDestroy(() => {
        if (listener) {
            if (hasTouchInterface) {
                document.addEventListener("touchend", listener);
            } else {
                document.addEventListener("selectionchange", listener);
            }
        }
    })
</script>

<div bind:this={wrapperEl} on:selectionchange>
    <slot />
</div>
