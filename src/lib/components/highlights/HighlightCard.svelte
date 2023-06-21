<script lang="ts">
    import EventCard from '$lib/components/events/card.svelte';
    import HighlightContent from '$lib/components/highlights/HighlightContent.svelte';

    import ndk from '$lib/stores/ndk';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import NDKLongForm from '$lib/ndk-kinds/long-form';
    import AvatarWithName from '../AvatarWithName.svelte';
    import { tagToNip19 } from '$lib/utils';
    import { getContext, onDestroy, onMount } from 'svelte';
    import type { NDKEventStore } from '$lib/stores/ndk';
    import Favicon from '$lib/components/Favicon.svelte';

    export let highlight: NDKHighlight;
    export let article: NDKLongForm | NDKEvent | undefined = undefined;
    export let skipTitle: boolean = getContext("skipTitle") ?? false;
    export let skipButtons: boolean = false;
    export let skipFooter: boolean = false;
    export let disableClick: boolean = false;
    export let expandedContext: boolean = false;
    export let skipReplies = false;

    let articlePromise: Promise<NDKLongForm | NDKEvent | string | undefined>;

    if (article) {
        articlePromise = Promise.resolve(article);
    } else {
        try {
            articlePromise = highlight.getArticle();
        } catch (e) {
            console.log(highlight)
            console.error(e);
            articlePromise = Promise.resolve(undefined);
        }
    }

    let replies: NDKEventStore<NDKEvent>;

    onMount(() => {
        if (!skipReplies) {
            replies = $ndk.storeSubscribe(
                { kinds: [1], ...highlight.filter()},
                { closeOnEose: false }
            );
        }
    });

    onDestroy(() => {
        if (replies) replies.unsubscribe();
    });

    function onContentClick(e: Event) {
        if (disableClick) return;

        // see if there is an element that has attribute data-highlight with the id of the highlight
        // if there is, then we want to scroll to that element
        const el = document.querySelector(`[data-highlight-id="${highlight.id}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            el.classList.add('bg-slate-100');
            setTimeout(() => {
                el.classList.remove('bg-slate-100');
            }, 1000);

            e.preventDefault();
        } else {
            if (window && window.find && window.find(highlight.content)) {
                e.preventDefault();
            }
        }
    }

    function linkToArticle() {
        const tag = highlight.getArticleTag();

        if (!tag) return '#';

        const val = tagToNip19(tag);

        if (!val) return '#';

        if (val.startsWith('http')) {
            return `/load?url=${encodeURIComponent(val)}`
        } else if (val.startsWith('n')) {
            return `/a/${val}`;
        } else {
            return '#';
        }
    }
</script>

{#await articlePromise then article}
    <EventCard
        event={highlight}
        skipHeader={skipTitle}
        {skipButtons}
        replies={($replies||[])}
        byString={"highlighted by"}
        {skipFooter}
        class="bg-orange-50 border-orange-100"
    >
        <div slot="header">
            {#if article instanceof NDKLongForm && article.title}
                <div class="text-xl text-zinc-900 font-semibold truncate">
                    <a href={linkToArticle()}>{article.title}</a>
                </div>
            {:else if highlight?.url && highlight.url.startsWith('https://')}
                <div class="text-xl text-zinc-900 font-semibold truncate flex flex-row items-center gap-2">
                    <Favicon url={highlight.url} class="w-8 h-8 rounded-md" />
                    <a href={linkToArticle()}>{new URL(highlight.url).hostname}</a>
                </div>
            {:else if article?.author}
                <a href={linkToArticle()}>Note <AvatarWithName pubkey={article.author.hexpubkey()} avatarClass="w-10 h-10" /></a>
            {:else if typeof article === 'string'}
                <a class="font-semibold" href={linkToArticle()}>{article}</a>
            {/if}
        </div>

        <a href={linkToArticle()} on:click={onContentClick} class="
            leading-relaxed h-full flex flex-col
            py-2
            overflow-auto
            {$$props.class}
        ">
            <HighlightContent
                {highlight}
                {article}
                {expandedContext}
            />
        </a>

        {#if highlight.getMatchingTags('t').length > 0}
            <div class="text-zinc-700 text-base whitespace-normal text-left">
                {#each highlight.getMatchingTags('t') as topicTag}
                    <span class="inline-flex items-center rounded-full border border-orange-500 px-3 py-1 text-sm font-medium text-orange-500 mr-2 mb-1">#{topicTag[1]}</span>
                {/each}
            </div>
        {/if}
    </EventCard>
{/await}
