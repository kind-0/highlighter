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
    import type NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card } from 'flowbite-svelte';
    import NewUserInstruction from '../NewUserInstruction.svelte';
    import { onDestroy } from 'svelte';
    import NDKHighlight from '$lib/ndk-kinds/highlight';
    import MarkedContent from './MarkedContent.svelte';
    import Avatar from '../Avatar.svelte';
    import Name from '../Name.svelte';
    import AvatarWithName from '../AvatarWithName.svelte';

    export let article: NDKEvent | NDKLongForm | string;
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

    let newHighlightItem: NDKHighlight | undefined;

    /**
     * Choose the context for the highlight
     */
    function chooseContext(selection: string, sentence: string, paragraph: string): string {
        let context = paragraph;

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
        console.log(`setting topics from ${topics} to ${articleTopics}`)
        topics = articleTopics;
    }

</script>

<svelte:head>
    <title>{articleTitle() || "Highlighter.com"}</title>
</svelte:head>

<div class="flex flex-col md:flex-row w-full mx-auto md:px-6">
    <Card size="xl" class="md:w-7/12 leading-loose flex flex-col gap-2 text-lg">
        <!-- Title -->
        {#if articleTitle()}
            <h1 class="text-5xl text-zinc-800 font-black leading-normal text-left">{articleTitle()}</h1>
        {/if}

        <div class="flex flex-row justify-between mb-2">
            <!-- Author / URL -->
            {#if article?.author && article?.author?.hexpubkey()}
                <AvatarWithName
                    pubkey={article.author.hexpubkey()}
                    avatarClass="w-12 h-12 rounded-full"
                    nameClass="text-xl font-black"
                />
            {:else if url}
                <div class="text-slate-600 text-xs whitespace-nowrap">
                    {url}
                </div>
            {:else}
                <div></div>
            {/if}
        </div>


        <!-- Highlight count on mobile -->
        {#if $highlights && $highlights.length > 0}
            <a href="#highlights" class="
                sm:hidden
                font-sans text-base
                text-purple-500
            ">{$highlights?.length} highlights</a>
        {/if}

        {#if article?.image}
            <div class="flex flex-row justify-center">
                <img src={article.image} class="w-full" />
            </div>
        {/if}

        <!-- Content -->
        <HighlightWrapper on:selectionchange={onSelectionChange}>
            <article class="my-2">
                <Article>
                    {#if $$slots.default}
                        <slot />
                    {:else if renderAsHtml}
                        {@html content}
                    {:else}
                        <MarkedContent
                            content={content??""}
                            {unmarkedContent}
                            highlights={$highlights}
                            tags={article.tags}
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
                        bind:topics
                    />
                </div>
            {/if}

            <div class="
                {newHighlightItem ? 'opacity-50' : ''}
                transition duration-100
                md:mb-96
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

<style>
    h1, article {
        font-family: 'Montserrat', sans-serif;
        font-family: 'Outfit', sans-serif;
    }
</style>