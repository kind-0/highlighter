<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import LinkIcon from '$lib/icons/Link.svelte';

    import NoteCard from '$lib/components/notes/card.svelte';

    import HighlightButton from '$lib/components/events/buttons/HighlightButton.svelte';
    import BookmarkButton from '$lib/components/events/buttons/bookmark.svelte';
    import ZapsButton from '$lib/components/events/buttons/zaps.svelte';
    import RepliesButton from '$lib/components/events/buttons/replies.svelte';
    import BoostButton from '$lib/components/events/buttons/boost.svelte';

    import CardContent from './content.svelte';

    import Avatar from "../Avatar.svelte";
    import Name from "../Name.svelte";

    import tsToNicePassedTimeString from "$lib/utils/tsToNicePassedTimeString";

    import { createDraggableEvent } from "$lib/utils/draggable";

    export let event: NDKEvent;

    export let skipHeader = false;
    export let skipFooter = false;
    export let skipButtons = false;
    export let userPubkey: string | undefined = undefined;
    export let byString: string | undefined = undefined;
    export let expandReplies = false;
    export let draggable = true;

    export let replies: NDKEvent[];

    if (!userPubkey) userPubkey = event.pubkey;

    let draggableHandler: any;

    if (draggable) {
        draggableHandler = createDraggableEvent(event);
    } else {
        draggableHandler = {};
    }




    let deleted = false;



    let zappedAmount: number;
</script>

{#if !deleted}
    <div class="flex flex-col w-full gap-6">
        <div use:draggableHandler>
            <div class="
                card card-bordered
                flex flex-col gap-2 group h-full
                {$$props.class}
            ">
                <div class="card-body !px-6 py-4">
                    {#if !skipHeader}
                        <!-- Header -->
                        <div class="card-title flex flex-row justify-between items-start relative">
                            <div class="flex flex-col gap-2 overflow-clip w-full">
                                <div class="flex flex-row gap-4 items-start">
                                    {#if $$slots.header}
                                        <slot name="header" />
                                    {:else}
                                        <Avatar pubkey={userPubkey} class="h-8" />
                                        <div class="text-lg">
                                            <Name pubkey={userPubkey} />
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/if}

                    <slot />

                    {#if !$$slots.default}
                        <div class="
                            leading-relaxed h-full flex flex-col
                            overflow-auto
                            {$$props.class}
                        ">
                            <CardContent
                                note={event.content}
                                tags={event.tags}
                                kind={event.kind}
                            />
                        </div>
                    {/if}

                    {#if !skipFooter}
                        <!-- Footer -->
                        <div class="
                            flex flex-row
                            items-center
                            justify-between
                            w-full
                            rounded-b-lg
                            pb-0
                            relative
                        ">
                            <div class="flex flex-row gap-4 items-center whitespace-nowrap">
                                <a
                                    href="/p/{userPubkey}/highlights"
                                    class="flex flex-row gap-4 items-center justify-center">
                                    <Avatar pubkey={userPubkey} class="w-8 h-8" />
                                    <div class=" text-xs hidden sm:block truncate">
                                        {byString||''}
                                        <Name pubkey={userPubkey} />
                                    </div>
                                </a>
                            </div>

                            <div class="
                                flex flex-row gap-4 items-center
                                text-base-100-content
                                z-10
                            ">
                                {#if !skipButtons}
                                    {#if event.kind !== 9802}
                                        <div class="opacity-0 group-hover:opacity-100 transition duration-300">
                                            <HighlightButton {event} />
                                        </div>
                                    {/if}
                                    <div class="opacity-0 group-hover:opacity-100 transition duration-300">
                                        <BookmarkButton {event} />
                                    </div>

                                    <div class="opacity-0 group-hover:opacity-100 transition duration-300">
                                        <BoostButton {event} />
                                    </div>

                                    {#if replies}
                                        <div class="opacity-0 group-hover:opacity-100 transition duration-300">
                                            <RepliesButton {event} />
                                        </div>
                                    {/if}

                                    <div class="opacity-0 group-hover:opacity-100 transition duration-300">
                                    <div class="tooltip" data-tip="Link to this note">
                                            <a href={`/e/${event.encode()}`}>
                                                <LinkIcon class="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>

                                    <div class="
                                        {zappedAmount === 0 ? "opacity-0 group-hover:opacity-100 transition duration-300" : ""}
                                    ">
                                        <ZapsButton bind:zappedAmount {event} />
                                    </div>

                                    <div class="text-sm">
                                        {tsToNicePassedTimeString(event.created_at,5)}
                                    </div>

                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <div class="dropdown">
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                                        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if replies?.length && replies?.length > 0}
            {#if expandReplies}
                {#each replies as reply}
                    <div class="ml-6">
                        <NoteCard event={reply} {expandReplies} />
                    </div>
                {/each}
            {:else}
                <button class="
                    text-base text-left text-accent -mt-4
                    font-semibold
                    px-4
                " on:click={() => { expandReplies = true }}>
                    View replies...
                </button>
            {/if}
        {/if}
    </div>
{/if}