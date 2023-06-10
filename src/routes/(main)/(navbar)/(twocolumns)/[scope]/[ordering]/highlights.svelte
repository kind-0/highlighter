<script lang="ts">
    import { currentScope } from '$lib/store';
    import type { Observable } from "dexie";
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';
    import HighlightInterface from '$lib/interfaces/highlights';
    import ArticleCardWithHighlights from '$lib/components/articles/cards/with-highlights.svelte';
    import { onDestroy } from 'svelte';

    /**
     * Whether to skip showing the user who did the highlight
     */
    export let skipHighlighter: boolean = false;

    /**
     * Maximum number of highlights to show by default on each article card
     */
    export let maxHighlightCountToShow: number | undefined = undefined;
    export let scope: string | undefined = undefined;
    export let pubkey: string | undefined = undefined;

    let prevScope: string;

    let pubkeys: string[] | undefined = undefined;

    $: if (scope !== prevScope && scope) {
        prevScope = scope;

        switch (scope) {
            case "pubkey":
                if (!pubkey) throw new Error('pubkey is required for scope "pubkey"');
                pubkeys = [pubkey];
                break;
            default:
                pubkeys = $currentScope.pubkeys;
        }

        console.log(`current scope pubkeys has ${$currentScope.pubkeys?.length}`)

        loadArticlesGroupedByHighlights({pubkeys});
    }

    let subs: NDKSubscription[] = [];
    let items: Observable<App.Highlight[]>;

    onDestroy(() => {
        for (const sub of subs) { sub.stop(); }
    });

    async function loadArticlesGroupedByHighlights(filter: any = {}) {
        const oneMonthAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
        filter = {
            limit: 500,
            since: oneMonthAgo,
            ...filter
        };

        items = HighlightInterface.load(filter);
		subs = HighlightInterface.startStream(filter);

        return items;
    }

    let processedItemCount = 0;
    let taggedEvents: Record<string, number> = {};
    let taggedEventIds: string[] = [];

    $: if ($items?.length !== processedItemCount) {
        processedItemCount = $items?.length ?? 0;

        // go through all the items and get the tagged event
        for (const item of $items ?? []) {
            const taggedEventId = item.articleId;
            if (!taggedEventId) { console.log('item without articleId', item); continue; }

            if (!taggedEvents[taggedEventId]) {
                taggedEvents[taggedEventId] = 0;
            }

            taggedEvents[taggedEventId]++;
        }

        // sort the tagged events by count
        taggedEventIds = Object.entries(taggedEvents)
            .sort((a, b) => b[1] - a[1])
            .map((a) => a[0]);
    }
</script>

<ul class="flex flex-col gap-8">
    {#each taggedEventIds as articleId}
        <li class="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
            <ArticleCardWithHighlights
                id={articleId}
                highlightsFrom={pubkeys}
                {maxHighlightCountToShow}
                {skipHighlighter}
            />
        </li>
    {/each}
</ul>
