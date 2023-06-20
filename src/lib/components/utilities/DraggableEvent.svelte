<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    export let event: NDKEvent;

    function dragStart(dragEvent: DragEvent) {
        if (!dragEvent.dataTransfer) return;
 
        const tag = event.tagReference();

        console.log('drag id', event.id);
        console.log('drag tag', tag);

        const data = JSON.stringify({ id: event.id, tag });
        dragEvent.dataTransfer.setData('application/json', "this value");
    }
</script>

<div
    draggable={true}
    on:dragstart={dragStart}>
    <slot />
</div>