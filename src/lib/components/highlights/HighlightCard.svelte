<script lang="ts">
    import EventCard from "$lib/components/events/EventCard.svelte";
    import HighlightContent from '$lib/components/highlights/HighlightContent.svelte';

    import ndk from '$lib/stores/ndk';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import type NDKLongForm from '$lib/ndk-kinds/long-form';
    import { onDestroy, onMount } from 'svelte';
    import type { NDKEventStore } from '$lib/stores/ndk';
    import linkToArticle from './link-to-article';
    import EventTags from '../events/EventTags.svelte';
    import HighlightHeader from "./HighlightHeader.svelte";

    export let highlight: NDKHighlight;
    export let article: NDKLongForm | NDKEvent | undefined = undefined;
    export let disableClick: boolean = false;
    export let expandedContext: boolean = false;
    export let skipTitle: boolean = false;
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
</script>

{#await articlePromise then article}
    <EventCard
        event={highlight}
        authorAction={"highlighted by"}
        skipHeader={skipTitle}
        class={$$props.class}
    >
        <div slot="header" class="w-full truncate">
            {#if !skipTitle}
                <HighlightHeader {highlight} />
            {/if}
        </div>

        <a href={linkToArticle(highlight)} on:click={onContentClick} class="
            h-full flex flex-col
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
{/await}
