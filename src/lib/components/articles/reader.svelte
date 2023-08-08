<script lang="ts">
    import { NDKEvent, type NDKFilter } from '@nostr-dev-kit/ndk';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import NewHighlight from '$lib/components/highlights/NewHighlight.svelte';
    import { currentUser, currentUserFollowPubkeys, currentScope } from '$lib/store';
    import { fade } from 'svelte/transition';
    import { fetchFollowers } from '$lib/currentUser';
    import { derived, type Readable } from 'svelte/store';
    import MarginNotePopup from './MarginNotePopup.svelte';

    import HighlightWrapper from '../HighlightWrapper.svelte';
    import Article from '../Article.svelte';
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import { onDestroy } from 'svelte';
    import NDKHighlight from '$lib/ndk-kinds/highlight';
    import MarkedContent from './MarkedContent.svelte';
    import AvatarWithName from '../AvatarWithName.svelte';
    import RightDrawerLayout from '$lib/layouts/RightDrawerLayout.svelte';

    export let article: NDKEvent | NDKArticle | string;
    export let content: string | undefined = undefined;
    export let unmarkedContent: string;
    export let url: string | undefined = undefined;
    export let renderAsHtml: boolean = false;

    let scope: string;

    let highlightFilter: any;
    let needsFilterUpdate: boolean;

    let highlights: NDKEventStore<NDKHighlight>;

    // Set filter for current view
    $: if (scope !== $currentScope.label) {
        scope = $currentScope.label;
        let pubkeys: string[] | undefined | null = null;

        if (scope === 'network') {
            // check if we have the contacts loaded
            if (!$currentUserFollowPubkeys) {
                fetchFollowers();
            } else {
                // update the filter
                pubkeys = $currentUserFollowPubkeys;
            }
        } else if (scope === 'personal' && $currentUser?.hexpubkey()) {
            pubkeys = [$currentUser?.hexpubkey()];
        } else if (scope === 'global') {
            pubkeys = undefined;
        }

        // If pubkeys has been explicitly set to a value or undefined
        if (pubkeys !== null) {
            highlightFilter = {pubkeys};
        }

        needsFilterUpdate = true;
    }

    let deduppedHighlights: Readable<NDKHighlight[]> | undefined;

    // Apply filter when it's ready
    $: if (needsFilterUpdate) {
        needsFilterUpdate = false;

        if (highlights) {
            highlights.unsubscribe();
        }

        let articleFilter: NDKFilter;

        if (article instanceof NDKEvent) {
            articleFilter = article.filter();
        } else {
            articleFilter = { "#r": [article.url ?? article] };
        }

        highlights = $ndk.storeSubscribe({
            kinds: [9802 as number],
            ...articleFilter,
        }, { closeOnEose: false }, NDKHighlight);

        deduppedHighlights = derived(highlights, ($highlights) => {
            const uniqueItems: NDKHighlight[] = [];
            const seenContent = new Set();

            $highlights.forEach(item => {
                let content = item.content.trim()+item.pubkey;
                if (!seenContent.has(content)) {
                    seenContent.add(content);
                    uniqueItems.push(item);
                }
            });

            return uniqueItems;
        });
    }

    onDestroy(() => {
        highlights?.unsubscribe();
    });

    let newHighlightItem: NDKHighlight | undefined;
    let openedHighlight: NDKHighlight | undefined;

    /**
     * Choose the context for the highlight
     */
    function chooseContext(selection: string, sentence: string, paragraph: string): string {
        let context = sentence;

        // If the selection is 3x shorter than the paragraph, use the sentence
        if (
            selection.length > 30 && // wait until there is enough text selected to make this call, otherwise the UX is weird
            selection.length * 20 < paragraph.length) {
            context = sentence + '… sentence ' + selection.length + 'paragraph:' + paragraph.length;
        }

        // if (selection.length >= paragraph.length) {
        //     context = undefined;
        // }

        return context;
    }

    function onSelectionChange(e: Event) {
        console.log('here')
        let {selection, sentence, paragraph } = e.detail;
        let context: string | undefined;

        selection = selection.trim();
        paragraph = paragraph.trim();
        sentence = sentence.trim();

        context = chooseContext(selection, sentence, paragraph);

        if (selection.trim() === '') return;

        if (selection) {
            if (!newHighlightItem) {
                newHighlightItem = new NDKHighlight($ndk);
                newHighlightItem.author = $currentUser;

                if (article.id) {
                    newHighlightItem.article = article!;
                } else if (article.url) {
                    newHighlightItem.article = article.url;
                }
            }

            newHighlightItem.content = selection;
            newHighlightItem.context = context;
        } else {
            newHighlightItem = undefined;
        }
    }

    function onNewHighlightClose() {
        newHighlightItem = undefined;
        openedHighlight = undefined;
    }

    function articleTitle() {
        if (article instanceof NDKEvent) {
            if (!article.title) {
                return undefined;
            }
        }
        return article?.title || article?.url || article.toString();
    }

    let articleTopicsId: string;
    let topics: string[] = [];

    $: if (article?.id && articleTopicsId !== article.id) {
        articleTopicsId = article.id;
        const articleTopics = (article.tags??[]).filter(t => t[0] === 't').map(t => t[1]).slice(0,10);
        topics = articleTopics || [];
    }

    function highlightClicked(e: Event) {
        const highlight = e.detail;
        openedHighlight = highlight;
        topics = [];
    }
</script>

<svelte:head>
    <title>{articleTitle() || "Highlighter.com"}</title>
</svelte:head>

<RightDrawerLayout>
    <div class="flex flex-col md:flex-row w-full mx-auto md:px-6">
        <div class="card md:w-7/12 leading-loose flex flex-col gap-2 text-lg card-compact md:card-normal">
            <div class="card-body">
                <!-- Title -->
                {#if articleTitle()}
                    <h1 class="card-title flex flex-row justify-center text-2xl md:text-3xl font-black md:text-center leading-normal">{articleTitle()}</h1> {/if}

                <div class="flex flex-row justify-between mb-2 overflow-clip items-center">
                    <!-- Author / URL -->
                    {#if article?.author && article?.author?.hexpubkey()}
                        <AvatarWithName
                            pubkey={article.author.hexpubkey()}
                            avatarClass="w-12 h-12 rounded-full"
                            nameClass="text-xl font-semibold"
                        />
                    {:else if url}
                        <div class="text-xs whitespace-normal">
                            {url}
                        </div>
                    {:else}
                        <div></div>
                    {/if}
                </div>

                {#if $$slots.preArticle}
                    <slot name="preArticle" />
                {/if}

                {#if article?.image}
                    <div class="flex flex-row justify-center">
                        <img src={article.image} class="max-h-64" />
                    </div>
                {/if}

                <!-- Content -->
                <HighlightWrapper on:selectionchange={onSelectionChange}>
                    <article class="my-2">
                        <Article class="highlighter">
                            {#if $$slots.default}
                                <slot />
                            {:else}
                                <MarkedContent
                                    {renderAsHtml}
                                    content={content??""}
                                    {unmarkedContent}
                                    highlights={$highlights}
                                    tags={article.tags}
                                    addNewLines={true}
                                    on:highlight-clicked={highlightClicked}
                                />
                            {/if}
                        </Article>
                    </article>
                </HighlightWrapper>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="relative flex-grow" id="sidebarContainer">
            <div class="px-4 md:h-screen h-screen">
                {#if newHighlightItem}
                    <div class="z-50 fixed top-20" transition:fade>
                        <NewHighlight
                            highlight={newHighlightItem}
                            on:close={onNewHighlightClose}
                            bind:topics
                        />
                    </div>
                {/if}

                {#if openedHighlight}
                    <div class="z-50 fixed top-20" transition:fade>
                        <NewHighlight
                            highlight={openedHighlight}
                            on:close={onNewHighlightClose}
                            bind:topics
                        />
                    </div>
                {/if}

                <div class="
                    {(newHighlightItem || openedHighlight) ? 'opacity-50' : ''}
                    transition duration-100
                    md:mb-96
                ">
                    {#if article && highlightFilter}
                        <div class="flex flex-col gap-4">
                            {#key highlightFilter}
                                {#each $deduppedHighlights as highlight}
                                    <MarginNotePopup markId={highlight.id} user={highlight.author} />
                                {/each}
                            {/key}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</RightDrawerLayout>