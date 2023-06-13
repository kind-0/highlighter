<script lang="ts">
    import EventCard from '$lib/components/events/card.svelte';
    import HighlightContent from '$lib/components/highlights/HighlightContent.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import NDKLongForm from '$lib/ndk-kinds/long-form';
    import { onMount } from 'svelte';
    import AvatarWithName from '../AvatarWithName.svelte';

    export let highlight: NDKHighlight;
    export let article: NDKLongForm | NDKEvent | string | undefined;
    export let skipTitle: boolean = false;
    export let skipButtons: boolean = false;
    export let skipFooter: boolean = false;
    export let disableClick: boolean = false;
    export let expandedContext: boolean = true;

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
        if (article?.encode) {
            return `/a/${article.encode()}`;
        } else if (article?.url) {
            return `/load?url=${encodeURIComponent(article.url)}`;
        } else if (article?.length > 0) {
            return `/load?url=${encodeURIComponent(article)}`;
        } else {
            return '#';
        }
    }
</script>

<EventCard
    event={highlight}
    skipHeader={skipTitle}
    {skipButtons}
    byString={"highlighted by"}
    {skipFooter}
>
    <div slot="header">
        {#if article instanceof NDKLongForm && article.title}
            <div class="text-xl font-semibold truncate">
                <a href={linkToArticle()}>{article.title}</a>
            </div>
        {:else if highlight?.url && highlight.url.startsWith('https://')}
            <div class="text-xl font-semibold truncate flex flex-row items-center gap-2">
                <img src={`https://${new URL(highlight.url).hostname}/favicon.ico`} class="w-8 h-8 rounded-md" />
                <a href={linkToArticle()}>{new URL(highlight.url).hostname}</a>
            </div>
        {:else if article?.author}
            <a href={linkToArticle()}>Note <AvatarWithName pubkey={article.author.hexpubkey()} /></a>
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
</EventCard>

<style>
    /* :global(.event-card) {
        @apply text-lg;
    } */
</style>