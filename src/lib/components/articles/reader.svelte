<script lang="ts">
    import HighlightInterface from '$lib/interfaces/highlights';
    import NoteInterface from '$lib/interfaces/notes';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';
    import ScopeDropdown from '$lib/components/ScopeDropdown.svelte';
    import HighlightList from '$lib/components/HighlightList.svelte';
    import ndk from '$lib/stores/ndk';
    import HighlightListItemForm from '$lib/components/HighlightListItemForm.svelte';
    import { currentUser, currentUserFollowPubkeys, currentScope } from '$lib/store';
    import { fade } from 'svelte/transition';
    import { fetchFollowers } from '$lib/currentUser';

    import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';

    import HighlightWrapper from '../HighlightWrapper.svelte';
    import Article from '../Article.svelte';
    import CardContent from '$lib/components/events/content.svelte';
    import type NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card } from 'flowbite-svelte';
    import NewUserInstruction from '../NewUserInstruction.svelte';

    export let article: NDKEvent | NDKLongForm | App.Article | undefined = undefined;
    export let content: string | undefined = undefined;
    export let unmarkedContent: string;
    export let url: string | undefined = undefined;

    let articleId: string;

    $: if (article?.tagId && article?.tagId() && article?.tagId() !== articleId) {
        articleId = article.tagId();
        notes = NoteInterface.load({articleId});
    }

    let scope = $currentScope.label;

    let highlightFilter: any;
    let currentHighlightFilter: any;

    let highlights: any;

    let notes;
    let activeSub: NDKSubscription[] | undefined;

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

        if (articleId) highlightFilter.articleId = articleId;
        if (url) highlightFilter.url = url;
    }

    // Apply filter when it's ready
    $: if (highlightFilter !== currentHighlightFilter) {
        console.log({highlightFilter, currentHighlightFilter});
        currentHighlightFilter = highlightFilter;

        highlights = HighlightInterface.load(highlightFilter);
        activeSub = HighlightInterface.startStream(highlightFilter);
    }

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

    let newHighlightItem: App.Highlight | undefined;

    function onSelectionChange(e: Event) {
        let {selection, sentence, paragraph } = e.detail;

        selection = selection.trim();
        sentence = sentence.trim();

        if (selection.length >= sentence.length) {
            sentence = undefined;
        }

        if (selection.trim() === '') return;

        if (selection) {
            newHighlightItem = {
                id: undefined,
                articleId,
                content: selection,
                pubkey: $currentUser?.hexpubkey()!,
                scope,
                context: sentence,
            };

            if (url) newHighlightItem.url = url;
        }
    }

    function onNewHighlightClose() {
        newHighlightItem = undefined;
    }
</script>

<svelte:head>
    <title>{article?.title || "Highlighter.com"}</title>
</svelte:head>

<div class="flex flex-col md:flex-row w-full mx-auto md:px-6">
    <Card size="full" class="md:w-7/12 leading-loose flex flex-col gap-2 text-lg">
        {#if article}
            {#if article?.title}
                <!-- Title -->
                <h1 class="text-2xl font-bold font-sans leading-normal text-left">{article?.title}</h1>
            {/if}

            <div class="flex flex-row justify-between">
                <!-- Author / URL -->
                {#if article?.author}
                    <h2 class="flex flex-row items-center text-sm sm:text-sm gap-4">
                        <div class="flex flex-row gap-4 items-start">
                            <Avatar ndk={$ndk} user={article.author} class="w-10 h-10 rounded-full" />
                            <div class=" text-gray-500 text-lg">
                                <Name ndk={$ndk} user={article.author} />
                            </div>
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
                                note={content}
                                tags={article.tags}
                                addNewLines={article.kind !== 30023}
                            />
                        {/if}
                    </Article>
                </article>
            </HighlightWrapper>
        {/if}
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
                        articleEvent={article.id ? article : undefined}
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
                            skipTitle={true}
                            items={highlights}
                        />
                    {/key}
                {/if}
            </div>
        </div>
    </div>
</div>
