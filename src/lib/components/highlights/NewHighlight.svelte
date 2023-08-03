<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { NDKEvent, NDKList, type NostrEvent } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import TopicInput from '../TopicInput.svelte';
    import MainCtaInSecondaryActionButton from '../buttons/MainCTAInSecondaryActionButton.svelte';
    import { CaretDown, Folder, Pen } from 'phosphor-svelte';
    import Textarea from '../Textarea.svelte';
    import HighlightContentBox from './HighlightContentBox.svelte';
    import ListSelectionDropdown from '$lib/components/lists/ListSelectionDropdown.svelte';
    import { NDKKind } from '$lib/ndk-kinds';
    import HighlightCard from './HighlightCard.svelte';

    export let highlight: NDKHighlight;
    export let topics: string[] = [];

    let saving = false;

    const dispatch = createEventDispatcher();

    function altTag(h: NDKEvent) {
        const content = `"${h.content}"\n\nThis is a highlight created on https://highlighter.com`;

        return ['alt', content];
    }

    function close() {
        dispatch('close');
    }

    async function saveHighlight() {
        highlight.content = highlight.content;

        // Add tags
        for (const topic of topics) {
            highlight.tags.push(['t', topic]);
        }

        // NIP-31
        highlight.tags.push(altTag(highlight));

        await highlight.publish();
    }

    async function repostHighlight() {
        const repost = await highlight.repost(false);

        // Add tags
        for (const topic of topics) {
            repost.tags.push(['t', topic]);
        }

        await repost.sign();
        await repost.publish();
    }

    async function save() {
        saving = true;

        if (isHighlightNew()) {
            await saveHighlight();
        } else {
            await repostHighlight();
        }

        let marginNoteEvent;

        // Create margin note from highlight
        if (marginNote) {
            marginNoteEvent = await createMarginNote();
        }

        // Add highlight to selected lists
        for (const list of selectedLists) {
            list.addItem(marginNoteEvent ?? highlight);
            list.created_at = Math.floor(Date.now() / 1000);
            await list.sign();
            await list.publish();
        }

        dispatch('close');
    }

    async function createMarginNote() {
        const marginNoteEvent = new NDKEvent($ndk, {
            kind: 1,
            content: `nostr:${highlight.encode()}\n${marginNote}`,
            tags: [
                ['q', highlight.tagId(), 'quote'],
                ['k', highlight.kind?.toString()]
            ]
        } as NostrEvent)

        for (const topic of topics) {
            highlight.tags.push(['t', topic]);
        }

        await marginNoteEvent.publish();

        return marginNoteEvent;
    }

    let contextWithHighlight = '';

    $: {
        if (highlight.context) {
            contextWithHighlight = highlight.context.replace(highlight.content, `<mark>${highlight.content}</mark>`);
        } else {
            contextWithHighlight = `<mark>${highlight.content}</mark>`;
        }
    }

    let marginNote = '';
    let selectedLists: Set<NDKList> = new Set();


    /**
     * If the highlight has a signature is because its not new.
     */
    function isHighlightNew() {
        return !highlight.sig;
    }
</script>

<div class="flex flex-col gap-4 overflow-y-auto">
    <div class="
        card card-compact card-bordered
        rounded-md
        flex flex-col h-full gap-2
        transition duration-100
        group
        max-h-screen
    ">
        <div class="card-body">
            <!-- If the highlight already exists (its someone else's), just display the item -->
            {#if isHighlightNew()}
                <HighlightContentBox>
                    {@html contextWithHighlight}
                </HighlightContentBox>
            {:else}
                <HighlightCard
                    {highlight}
                    skipTitle={true}
                />
            {/if}

            <!-- Comment -->
            <Textarea
                bind:value={marginNote}
                placeholder="Add your thoughts"
                class="
                    mt-4
                    border:base-300 border-opacity-50
                    bg-transparent
                    min-h-[25vh]
                    min-w-[25vw]
                "
            />

            <!-- Footer -->
            <div class="
                flex flex-row
                gap-8
                items-end justify-between
                w-full
                rounded-b-lg
                py-4 pb-0
            ">
                <div class="flex flex-row gap-4 items-center whitespace-nowrap">
                    <div class="flex flex-col gap-4">
                        <TopicInput
                            class="btn-outline btn-neutral !rounded-full"
                            bind:values={topics}
                        />
                        <ListSelectionDropdown
                            kinds={[NDKKind.GenericList, NDKKind.HighlightList]}
                            newListKind={NDKKind.HighlightList}
                            bind:selectedLists
                            class="btn-outline btn-neutral !rounded-full"
                            dropdownClass="dropdown-top"
                        >
                            <div class="flex flex-row items-center gap-2 font-normal whitespace-nowrap">
                                <Folder class="w-6 h-6" />
                                {#if selectedLists.size > 0}
                                    <span class="truncate">
                                        Stored in
                                        {#if selectedLists.size > 1}
                                            {selectedLists.size} folders
                                        {:else}
                                            {#each selectedLists as list}
                                                {list.name}
                                            {/each}
                                        {/if}
                                    </span>
                                {:else}
                                    Choose a folder
                                    <CaretDown class="w-4 h-4" />
                                {/if}
                            </div>
                        </ListSelectionDropdown>
                    </div>
                </div>

                <div class="
                    flex flex-row gap-4 items-center
                ">
                    <!-- Cancel Button -->
                    <button class="btn btn-ghost" on:click={close}>
                        Cancel
                    </button>

                    <!-- Save Button -->
                    <MainCtaInSecondaryActionButton
                        class="btn-lg"
                        on:click={save} disabled={saving}
                    >
                        <Pen class="w-4 h-4 mr-2" />
                        <div class="text-base-100-content">Save</div>
                    </MainCtaInSecondaryActionButton>
                </div>
            </div>
        </div>
    </div>
</div>