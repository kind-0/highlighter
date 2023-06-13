<script lang="ts">
    import { NDKEvent, type NDKFilter } from '@nostr-dev-kit/ndk';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';
    import ScopeDropdown from '$lib/components/ScopeDropdown.svelte';
    import HighlightList from '$lib/components/HighlightList.svelte';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import HighlightListItemForm from '$lib/components/HighlightListItemForm.svelte';
    import { currentUser, currentUserFollowPubkeys, currentScope } from '$lib/store';
    import { fade } from 'svelte/transition';
    import { fetchFollowers } from '$lib/currentUser';
    import { derived, type Readable } from 'svelte/store';

    import HighlightWrapper from '../HighlightWrapper.svelte';
    import Article from '../Article.svelte';
    import CardContent from '$lib/components/events/content.svelte';
    import NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card } from 'flowbite-svelte';
    import NewUserInstruction from '../NewUserInstruction.svelte';
    import { onDestroy } from 'svelte';
    import NDKHighlight from '$lib/ndk-kinds/highlight';

    export let article: NDKEvent | NDKLongForm | string;
    export let content: string | undefined = undefined;
    export let unmarkedContent: string;
    export let url: string | undefined = undefined;

    let scope = $currentScope.label;

    let highlightFilter: any;
    let currentHighlightFilter: any;

    let highlights: NDKEventStore<NDKHighlight>;

    // Set filter for current view
    $: if (scope !== currentScope.label) {
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
    }

    let deduppedHighlights: Readable<NDKHighlight[]> | undefined;

    // Apply filter when it's ready
    $: if (highlightFilter !== currentHighlightFilter) {
        console.log({highlightFilter, currentHighlightFilter});
        currentHighlightFilter = highlightFilter;

        let articleFilter: NDKFilter;

        if (article instanceof NDKEvent) {
            if (article.isParamReplaceable())
                articleFilter = { "#a": [article.tagId()] };
            else
                articleFilter = { "#e": [article.tagId()] };
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
                let content = item.content+item.pubkey;
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

    let markedHighlightCount = 0;

    $: if ($highlights && $highlights.length > 0 && markedHighlightCount !== $highlights.length) {
        markContent();
        markedHighlightCount = $highlights.length;
    }

    function markContent() {
        content = unmarkedContent;

        if (!content) return;

        for (const highlight of $highlights||[]) {
            if (!highlight.content) continue;
            // if (replacedHighlights[highlight.id!]) continue;
            content = content.replace(highlight.content, `<mark data-highlight-id="${highlight.id}">${highlight.content}</mark>`);
            // replacedHighlights[highlight.id!] = true;
        }
    }

    let newHighlightItem: NDKHighlight | undefined;

    function onSelectionChange(e: Event) {
        let {selection, sentence, paragraph } = e.detail;
        let context: string | undefined;

        selection = selection.trim();
        paragraph = paragraph.trim();
        sentence = sentence.trim();

        context = paragraph;

        if (selection.length >= paragraph.length) {
            context = undefined;
        }

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
    }

    function articleTitle() {
        return article?.title || article?.url || article;
    }
</script>

<svelte:head>
    <title>{articleTitle() || "Highlighter.com"}</title>
</svelte:head>

<div class="flex flex-col md:flex-row w-full mx-auto md:px-6">
    <Card size="full" class="md:w-7/12 leading-loose flex flex-col gap-2 text-lg">
        <!-- Title -->
        <h1 class="text-2xl font-bold font-sans leading-normal text-left">{articleTitle()}</h1>

        <div class="flex flex-row justify-between">
            <!-- Author / URL -->
            {#if article?.author}
                <h2 class="flex flex-row items-center text-sm sm:text-sm gap-4">
                    <div class="flex flex-row gap-4 items-start">
                        <!-- <Avatar ndk={$ndk} user={article.author} class="w-10 h-10 rounded-full" />
                        <div class=" text-gray-500 text-lg">
                            <Name ndk={$ndk} user={article.author} />
                        </div> -->
                    </div>
                </h2>
            {:else if url}
                <div class="text-slate-600 text-xs whitespace-nowrap">
                    {url}
                </div>
            {:else}
                <div></div>
            {/if}

            <!-- Publisher -->
            <!-- {#if publisher != article?.author}
                <h2 class="flex flex-row items-center text-sm sm:text-sm gap-4">
                    Published by
                    <div class="flex flex-row items-center gap-2">
                        <Avatar pubkey={article.publisher} klass="h-10" />
                        <Name pubkey={article.publisher} />
                    </div>
                </h2>
            {/if} -->
        </div>


        <!-- Highlight count on mobile -->
        {#if $highlights && $highlights.length > 0}
            <a href="#highlights" class="
                sm:hidden
                font-sans text-base
                text-purple-500
            ">{$highlights?.length} highlights</a>
        {/if}

        <!-- Content -->
        <HighlightWrapper on:selectionchange={onSelectionChange}>
            <article class="my-6 font-serif">
                <Article>
                    {#if $$slots.default}
                        <slot />
                    {:else}
                        <CardContent
                            note={content??""}
                            tags={article?.tags||[]}
                            addNewLines={article?.kind !== 30023}
                        />
                    {/if}
                </Article>
            </article>
        </HighlightWrapper>
    </Card>

    <!-- Sidebar -->
    <div class="relative">
        <div class="px-4 md:h-screen md:fixed overflow-auto md:w-5/12">
            <div class="flex flex-row justify-end mb-4">
                <ScopeDropdown bind:scope />
            </div>

            <NewUserInstruction />

            {#if newHighlightItem}
                <div class="mb-8" transition:fade>
                    <HighlightListItemForm
                        article={article.id ? article : undefined}
                        highlight={newHighlightItem}
                        on:close={onNewHighlightClose}
                    />
                </div>
            {/if}

            <div class="
                {newHighlightItem ? 'opacity-50' : ''}
                transition duration-100
            ">
                {#if article && highlightFilter}
                    {#key highlightFilter}
                        <HighlightList
                            expandedContext={false}
                            skipTitle={true}
                            items={$deduppedHighlights}
                        />
                    {/key}
                {/if}
            </div>
        </div>
    </div>
</div>
