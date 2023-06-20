<script lang="ts">
    import { NDKEvent } from "@nostr-dev-kit/ndk";

    import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte'

    import CopyIcon from '$lib/icons/Copy.svelte';
    import TrashIcon from '$lib/icons/Trash.svelte';
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

    import { signers } from "$lib/stores/signer";
    import ndk from "$lib/stores/ndk";

    import tsToNicePassedTimeString from "$lib/utils/tsToNicePassedTimeString";
    import { onMount } from "svelte";
    import { db } from "$lib/interfaces/db";

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

    let copiedEventId = false;
    let copiedEventJSON = false;

    let draggableHandler: any;

    if (draggable) {
        draggableHandler = createDraggableEvent(event);
    } else {
        draggableHandler = {};
    }

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

    let hasKeyForAuthor = false;
    let deleted = false;

    async function getSigner() {
        const user = await $ndk?.signer?.user();
        if (event.pubkey === user?.hexpubkey()) {
            return $ndk.signer;
        }

        const allSigners = Array.from($signers.entries()).map(([_, s]) => s);
        const signer = allSigners.find(s => s.user.hexpubkey() === event.pubkey);

        return signer ? signer.signer : undefined;
    }

    async function prepareDropdown() {
        hasKeyForAuthor = !!(await getSigner());
    }

    onMount(prepareDropdown);

    async function deleteEvent() {
        let signer = await getSigner();

        if (!signer) return;
        const user = await signer.user();

        const deletionEvent = new NDKEvent($ndk);
        deletionEvent.kind = 5;
        deletionEvent.tag(event);
        deletionEvent.pubkey = user.hexpubkey();
        await deletionEvent.sign(signer);
        await deletionEvent.publish();

        db.events.delete(event.tagId());
        deleted = true;
    }

    let zappedAmount: number;
</script>

{#if !deleted}
    <div class="flex flex-col w-full gap-6">
        <div use:draggableHandler>
            <Card class="
                flex flex-col gap-2 group h-full
                {$$props.class}
            " size="xl">
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
                            flex flex-row gap-4 items-center
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
                                    <a href={`/e/${event.encode()}`} class="
                                        text-slate-500 hover:text-orange-500
                                        flex flex-row items-center gap-2
                                    ">
                                        <LinkIcon class="w-4 h-4" />
                                    </a>
                                    <Tooltip color="black">Link to this note</Tooltip>
                                </div>

                                <div class="
                                    {zappedAmount === 0 ? "opacity-0 group-hover:opacity-100 transition duration-300" : ""}
                                ">
                                    <ZapsButton bind:zappedAmount {event} />
                                </div>

                                <div class="text-sm">
                                    {tsToNicePassedTimeString(event.created_at,5)}
                                </div>

                                <button on:click|stopPropagation={prepareDropdown}>
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

                                    {#if hasKeyForAuthor}
                                        <DropdownDivider />
                                        <DropdownItem class="flex flex-row items-center gap-2" on:click={deleteEvent}>
                                            <TrashIcon class="w-4 h-4" />
                                            Delete
                                        </DropdownItem>
                                    {/if}

                                </Dropdown>

                            {/if}
                        </div>
                    </div>
                {/if}
            </Card>
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
                    text-base text-left text-orange-500 -mt-4
                    font-semibold
                    px-4
                " on:click={() => { expandReplies = true }}>
                    View replies...
                </button>
            {/if}
        {/if}
    </div>
{/if}