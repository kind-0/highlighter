<script lang="ts">
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import HighlightContent from "./HighlightContent.svelte";

    export let highlight: NDKHighlight;
</script>

<HighlightContent
    {highlight}
/>