<script lang="ts">
	import ZapsButton from '$lib/components/events/buttons/zaps.svelte';
	import RepliesButton from '$lib/components/events/buttons/replies.svelte';
	import BoostButton from '$lib/components/events/buttons/boost.svelte';
	import BookmarkButton from '$lib/components/events/buttons/bookmark.svelte';
    import { NDKKind } from "$lib/ndk-kinds";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    import HighlightButton from "./buttons/HighlightButton.svelte";
    import { Link } from 'phosphor-svelte';
    import { currentUser } from '$lib/store';

    export let event: NDKEvent;

    let zappedAmount: number;

    function shouldShowHighlightButton() {
        const notAHighlight = event.kind !== NDKKind.Highlight;
        const qTag = event.tagValue('q');
        const kTag = event.tagValue('k') === '9802';

        return notAHighlight && !(qTag && kTag);
    }
</script>

<div class="
    flex flex-row gap-4 items-end
    text-base-100-content
    z-10
">
    {#if shouldShowHighlightButton()}
        <div class="opacity-0 group-hover:opacity-100 transition duration-300">
            <HighlightButton {event} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6" />
        </div>
    {/if}

    {#if $currentUser}
        <div class="md:opacity-0 group-hover:opacity-100 transition duration-300">
            <BookmarkButton {event} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6 p-1" />
        </div>

        <div class="md:opacity-0 group-hover:opacity-100 transition duration-300">
            <BoostButton {event} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6 p-1" />
        </div>

        <!-- {#if replies} -->
            <div class="md:opacity-0 group-hover:opacity-100 transition duration-300">
                <RepliesButton {event} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6 p-1" />
            </div>
        <!-- {/if} -->
    {/if}

    <div class="md:opacity-0 group-hover:opacity-100 transition duration-300">
    <div class="tooltip" data-tip="Link to this note">
            <a href={`/e/${event.encode()}`} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6 p-1">
                <Link class="w-4 h-4" />
            </a>
        </div>
    </div>

    <div class="
        {zappedAmount === 0 ? "md:opacity-0 group-hover:opacity-100 transition duration-300" : ""}
    ">
        <ZapsButton bind:zappedAmount {event} class="btn bg-base-100 hover:bg-base-200 btn-circle btn-xs w-6 h-6 p-1" />
    </div>
</div>