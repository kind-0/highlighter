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
                    dispatch('selectionchange', d);
                }
            } catch (e) {}
        }

        // when wrapperEl is selected
        if (hasTouchInterface) {
            wrapperEl.addEventListener("touchend", listener);
        } else {
            wrapperEl.addEventListener("selectionchange", listener);
        }
    })

    onDestroy(() => {
        if (listener) {
            if (hasTouchInterface) {
                wrapperEl.addEventListener("touchend", listener);
            } else {
                wrapperEl.addEventListener("selectionchange", listener);
            }
        }
    })
</script>

<div bind:this={wrapperEl} on:selectionchange>
    <slot />
</div>
