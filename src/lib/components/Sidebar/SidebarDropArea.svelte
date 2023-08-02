<script lang="ts">
    import { openModal } from "svelte-modals";
    import BookmarkModal from "$lib/modals/Bookmark.svelte";
    import DroppableEvent from "../utilities/DroppableEvent.svelte";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from '$lib/stores/ndk';

    function drop(e: Event) {
        const id = e.detail.id;

        console.log({id})
        if (!id) return;


        $ndk.fetchEvent(id).then(event => {
            if (event) {
                console.log(event)
                openModal(BookmarkModal, { event, listKind: 39802 });
            }
        })
    }
</script>

<DroppableEvent
    class="
        flex flex-col items-center justify-center rounded-lg border-4 border-dashed border-accent/20 bg-base-200 p-8 mt-4 w-full
    "
    hoverClass="!border-accent/80 text-xl"
    on:drop={drop}
>
    <div class="text-sm opacity-80 text-center text-accent leading-relaxed py-10">
        Drop your thought-provoking
        <br>
        highlights here
    </div>
</DroppableEvent>