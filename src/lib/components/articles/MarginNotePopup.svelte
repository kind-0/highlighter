<!--

# About

This component is used to display margin
notes in the sidebar on a reader component.

Each <MarginNotePopup> component represents a single margin note.

-->
<script lang="ts">
	import { rightDrawerContent } from '$lib/stores/right-drawer';
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import AvatarWithName from '$lib/components/AvatarWithName.svelte';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import LargeMarginNoteCard from "../events/margin-note/LargeMarginNoteCard.svelte";

    export let markId = '';
    export let user: NDKUser;

    const marginNotes: NDKEventStore<NDKEvent> = $ndk.storeSubscribe({
        kinds: [1],
        "#q": [markId]
    })

    let verticalHeight: number | undefined = undefined;
    let referenceElement: HTMLElement | null = null;

    function positionElement() {
        referenceElement = document.getElementById(markId);
        let containerElement = document.getElementById('sidebarContainer');

        const containerElementRect = containerElement?.getBoundingClientRect()
        const rect = referenceElement?.getBoundingClientRect()

        if (!rect) {
            setTimeout(positionElement, 500);
        }

        // get the height of the reference element
        if (rect && containerElementRect)
            verticalHeight = rect.y - containerElementRect.y;
    }

    $: positionElement();

    function hover(hovering: boolean) {
        // mark the reference element as active
        if (hovering) {
            referenceElement?.classList.add('active');
        } else {
            referenceElement?.classList.remove('active');
        }
    }
</script>

{#if verticalHeight}
    <div
        class="md:absolute"
        class:hidden={!!$rightDrawerContent}
        style="top: {verticalHeight}px; z-index: 999999; left: 1"
    >
        <div class="card card-compact bg-base-300 hidden">
            <div class="card-body text-xs">
                <AvatarWithName pubkey={user.hexpubkey()} />
            </div>
        </div>

        {#if $marginNotes?.length > 0}
            {#each $marginNotes as marginNote}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    on:mouseenter={() => hover(true)}
                    on:mouseleave={() => hover(false)}
                >
                    <LargeMarginNoteCard
                        event={marginNote}
                        skipHighlight={true}
                        class="cursor-pointer"
                    />
                </div>
            {/each}
        {/if}

    </div>
{/if}