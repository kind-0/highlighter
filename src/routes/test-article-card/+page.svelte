<script lang="ts">
    import ArticleContentCard from "$components/ContentCards/ArticleContentCard.svelte";
    import { NDKArticle, NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from '$lib/stores/ndk';
    import { onMount } from "svelte";
    import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";
    import Navbar from "$components/Navbar/Navbar.svelte";

    let events: NDKEventStore<NDKEvent>
    let articles: NDKArticle[]
    
    onMount(() => {
        console.log("Pulling Long-form content from relays...")
        events = $ndk.storeSubscribe(
            { kinds: [ 30023 ], limit: 10},
            { closeOnEose: true }
        )
    })

    $: if ($events) {
        articles = $events.map((event: NDKEvent) => {
            return new NDKArticle($ndk, event)
        })
        console.log(articles)
    }
</script>

<Navbar />

<div class="flex flex-col gap-5">
    <h1 class="text-base-100-content text-3xl font-bold">Recent Long Form Content Events</h1>
    <p>Each card shows the articles title, summary (if any), author, image and the zaps received (if any). Clicking any card load the corresponding article.</p>
    <div class="flex flex-row gap-3 overflow-x-scroll">
        {#if articles}
            {#each articles.slice(0, 20) as article}
                <ArticleContentCard {article} />
            {/each}
        {/if}
    </div>
</div>