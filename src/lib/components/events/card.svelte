<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    import { Dropdown, DropdownItem } from 'flowbite-svelte'

    import CopyIcon from '$lib/icons/Copy.svelte';
    import MoreOptionsIcon from '$lib/icons/MoreOptions.svelte';
    import LinkIcon from '$lib/icons/Link.svelte';
    import { Card } from 'flowbite-svelte'

    import NoteCard from '$lib/components/notes/card.svelte';

    import HighlightButton from '$lib/components/events/buttons/HighlightButton.svelte';
    import BookmarkButton from '$lib/components/events/buttons/bookmark.svelte';
    import ZapsButton from '$lib/components/events/buttons/zaps.svelte';
    import RepliesButton from '$lib/components/events/buttons/replies.svelte';
    import BoostButton from '$lib/components/events/buttons/boost.svelte';

    import CardContent from './content.svelte';

    import Avatar from "../Avatar.svelte";
    import Name from "../Name.svelte";
    import { Tooltip } from "flowbite-svelte";

    import tsToNicePassedTimeString from "$lib/utils/tsToNicePassedTimeString";

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

    let copiedEventId = false;
    let copiedEventJSON = false;
    let niceTime = event.created_at ? new Date(event.created_at * 1000).toLocaleString() : undefined;

    function copyId(e: Event) {
        e.stopPropagation();
        navigator.clipboard.writeText(event.encode());
        copiedEventId = true;
        setTimeout(() => {
            copiedEventId = false;
        }, 1500);
    }

    function copyJSON(e: Event) {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(event.rawEvent()));
        copiedEventJSON = true;
        setTimeout(() => {
            copiedEventJSON = false;
        }, 1500);
    }

    function dragStart(e: DragEvent) {
        if (!e.dataTransfer) return;

        const tag = event.tagReference();

        e.dataTransfer.setData('id', event.id as string);
        e.dataTransfer.setData('kind', event.kind!.toString());
        e.dataTransfer.setData('tag', JSON.stringify(tag));
    }
</script>

<div class="flex flex-col w-full gap-6">
    <div {draggable} on:dragstart={dragStart}>
        <Card class="
            flex flex-col gap-4 group h-full
            {$$props.class}
        " size="full">
            {#if !skipHeader}
                <!-- Header -->
                <div class="flex flex-row justify-between items-start relative">
                    <div class="flex flex-col gap-2 overflow-clip">
                        <div class="flex flex-row gap-4 items-start">
                            {#if $$slots.header}
                                <slot name="header" />
                            {:else}
                                <Avatar pubkey={userPubkey} klass="h-8" />
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
                            href="/p/{userPubkey}"
                            class="flex flex-row gap-4 items-center justify-center">
                            <Avatar pubkey={userPubkey} size='xs' />
                            <div class=" text-gray-500 text-xs hidden sm:block truncate">
                                {byString||''}
                                <Name pubkey={userPubkey} />
                            </div>
                        </a>
                    </div>

                    <div class="
                        absolute bottom-0 right-0
                        opacity-100
                        {!skipButtons ? 'group-hover:opacity-0' : ''}
                        transition duration-300
                        text-xs text-slate-500
                        z-0
                    ">
                        {tsToNicePassedTimeString(event.created_at,5)}
                    </div>

                    {#if !skipButtons}
                        <div class="
                            flex flex-row gap-4 items-center
                            opacity-0 group-hover:opacity-100
                            transition duration-300
                            z-10
                        ">
                            {#if event.kind !== 9802}
                                <HighlightButton {event} />
                            {/if}
                            <BookmarkButton {event} />

                            <ZapsButton {event} />

                            <BoostButton {event} />
                            {#if replies}
                                <RepliesButton {event} />
                            {/if}

                            <a href={`/e/${event.encode()}`} class="
                                text-slate-500 hover:text-orange-500
                                flex flex-row items-center gap-2
                            ">
                                <LinkIcon class="w-4 h-4" />
                            </a>
                            <Tooltip color="black">Link to this note</Tooltip>

                            <button on:click|stopPropagation={() => {}}>
                                <MoreOptionsIcon class="w-4 h-4" />
                            </button>
                            <Dropdown>
                                <DropdownItem class="flex flex-row items-center gap-2" on:click={copyId}>
                                    <CopyIcon class="w-4 h-4" />
                                    {copiedEventId ? 'Copied!' : 'Copy ID'}
                                </DropdownItem>

                                <DropdownItem class="flex flex-row items-center gap-2" on:click={copyJSON}>
                                    <CopyIcon class="w-4 h-4" />
                                    {copiedEventJSON ? 'Copied!' : 'Copy Event JSON'}
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    {/if}
                </div>
            {/if}
        </Card>
    </div>

    {#if replies?.length && replies?.length > 0}
        {#if !expandReplies}
            {#each replies as reply}
                <div class="ml-6">
                    <NoteCard event={reply} {expandReplies} />
                </div>
            {/each}
        {:else}
            <button class="
                text-base text-left text-orange-500 -mt-4
                font-semibold
                px-4
            " on:click={() => { expandReplies = false }}>
                View replies...
            </button>
        {/if}
    {/if}
</div>
