<script lang="ts">
	import NoteCard from '$lib/components/notes/card.svelte';
	import BoostButton from '$lib/components/events/buttons/boost.svelte';
	import BookmarkButton from '$lib/components/events/buttons/bookmark.svelte';
    import Zaps from "../events/buttons/zaps.svelte";
    import Name from "../Name.svelte";
    import Avatar from "../Avatar.svelte";

    import CommentIcon from '$lib/icons/Comment.svelte';
    import LinkIcon from '$lib/icons/Link.svelte';
    import ndk from "$lib/stores/ndk";

    import HighlightContent from "./HighlightContent.svelte";

    import { Tooltip } from "flowbite-svelte";
    import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import type NDKHighlight from '$lib/ndk-kinds/highlight';

    export let highlight: NDKHighlight;
    export let skipHighlighter = false;

    /**
     * URL to the article this highlight is from
     */
    export let url: string;

    let replies: any;
    let quotes: any;
    let npub = (new NDKUser({hexpubkey: highlight.pubkey})).npub;

    $: if (highlight?.id && !replies) {
        // replies = NoteInterface.load({ replies: [highlight.id] });
        // quotes = NoteInterface.load({ quotes: [highlight.id] });
    }

    function shouldDisplayQuote(highlight: NDKHighlight, quotes: NDKEvent[]) {
        return true;
    }
</script>

<li class="px-4 py-4 sm:px-0 group relative">
    <div class="flex flex-col gap-4">
        <div class="
        ">
            <HighlightContent {highlight} />
        </div>

        <div class="
            flex flex-row items-center justify-between
            {!skipHighlighter ? '' : "absolute bottom-0 right-0" }
        ">
            {#if !skipHighlighter}
                <div class="
                    text-sm font-medium text-zinc-600 flex flex-row items-center gap-2
                ">
                    <Avatar pubkey={highlight.pubkey} klass="w-4 h-4" />
                    by
                    <a href="/p/{npub}/highlights">
                        <Name pubkey={highlight.pubkey} />
                    </a>
                </div>
            {/if}

            <div class="
                flex flex-row items-center gap-4
            ">
                <BoostButton
                    event={highlight}
                    {highlight}
                    class="duration-200 opacity-0 group-hover:opacity-100"
                />

                <BookmarkButton
                    event={highlight}
                    class="duration-200 opacity-0 group-hover:opacity-100"
                />
                <Zaps {highlight} event={highlight}
                    class="duration-200 opacity-0 group-hover:opacity-100"
                />

                <a href={`/e/${highlight.encode()}`} class="
                    text-slate-500 hover:text-orange-500
                    flex flex-row items-center gap-2
                    duration-200 opacity-0 group-hover:opacity-100
                ">
                    <LinkIcon class="w-4 h-4" />
                </a>
                <Tooltip color="black">Link to this highlight</Tooltip>

                <a href={url} class="
                    {$quotes?.length > 0 ? 'text-orange-400 hover:text-orange-500' : 'text-slate-500 hover:text-orange-500'}
                    flex flex-row items-center gap-2
                    {$quotes?.length > 0 ? '' : 'duration-200 opacity-0 group-hover:opacity-100'}
                ">
                    <div class="w-4 h-4"><CommentIcon /></div>
                    {($quotes||[]).length}
                </a>
                <Tooltip color="black">View Notes</Tooltip>
            </div>
        </div>
    </div>
</li>