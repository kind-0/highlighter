<script lang="ts">
  import { currentScope } from "$lib/store";
  import ArticleCardWithHighlights from "$lib/components/articles/cards/ArticleCardWithHighlights.svelte";
  import { onDestroy, onMount } from "svelte";
  import type { NDKEventStore } from "$lib/stores/ndk";
  import ndk from "$lib/stores/ndk";
  import NDKHighlight from "$lib/ndk-kinds/highlight";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import type NDKLongForm from "$lib/ndk-kinds/long-form";

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

  $: if (scope !== prevScope && scope && prevScope && highlights) {
    prevScope = scope;

    switch (scope) {
      case "personal":
        if (!pubkey) throw new Error('pubkey is required for scope "pubkey"');
        pubkeys = [pubkey];
        break;
      default:
        pubkeys = $currentScope.pubkeys;
    }
    console.log("loading articles !!")

    loadArticlesGroupedByHighlights({ authors: pubkeys });
  }

  let highlights: NDKEventStore<NDKHighlight>;

  let taggedEventIds: string[] = [];

  onMount(() => {
    prevScope = scope!;
    const opts: NDKFilter = {};

    if (pubkeys && pubkeys.length > 0) {
      opts.authors = pubkeys;
    }
    console.log("loading articles !!")
    loadArticlesGroupedByHighlights(opts);
  });

  onDestroy(() => {
    highlights?.unsubscribe();
  });

  let activeFilter: any;
  let toSort = false
  let eosed = false;





  async function loadArticlesGroupedByHighlights(filter: any = {}) {
    highlights?.unsubscribe();

    const oneMonthAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
    filter = {
      limit: 500,
      // since: oneMonthAgo,
      kinds: [9802],
      ...filter,
    };
    console.log({ filter });

    activeFilter = filter;

    highlights = $ndk.storeSubscribe<NDKHighlight>(
      filter,
      { closeOnEose: true },
      NDKHighlight
    );
    highlights.onEose(() => {
    
      eosed = true;
      console.log(`eosed`, eosed);
      console.log("rendering ! as eosed")
});


    // console.log("highlights", $highlights);
  }


  /**
   * Marker to react when the number of highlights changes
   */
  let processedHighlightCount = 0;

  /**
   * Marker of highlight ids that have been counted
   */
  let processedHighlightIds: Set<string> = new Set();

  /**
   * Used to keep track of the total number of times an article was highlighted (for sorting)
   */
  let taggedEvents: Record<string, NDKHighlight[]> = {};
  let renderTaggedEvents: Record<string, NDKHighlight[]> = {};

  /**
   * Sorted list of article ids by the number of times they were highlighted
   */

//   $: console.log("highlights updated", $highlights);

//   $: console.log("taggedEventIds", taggedEventIdNumbers);

  let render = false;
  
  
  $: if (
    eosed && $highlights && $highlights?.length !== processedHighlightCount
      ) {

    // const timer = setTimeout( () => {
    //     render = true;
    //   console.log("render! in setTimeout")
    // }, 300)
      updateTaggedEventIds();

 }





let maxHighlightCount = 0

  function updateTaggedEventIds() {
    processedHighlightCount = $highlights?.length ?? 0;
    console.log(
    //   `starting to process with ${processedHighlightCount} highlights`
    );

    // go through all the highlights and get the tagged event
    for (const highlight of $highlights ?? []) {
      if (processedHighlightIds.has(highlight.id)) continue;
      processedHighlightIds.add(highlight.id);

      const tag = highlight.getArticleTag();
      if (!tag) continue;

      const taggedEventId = tag[1];

      if (!taggedEvents[taggedEventId]) {
        taggedEvents[taggedEventId] = [];
      }

      taggedEvents[taggedEventId].push(highlight);
    }

   sortArticles()
  }

  function sortArticles()  {

const allSortedIds = Object.entries(taggedEvents)
  .map(([id, highlights]) => [id, highlights.length] as [string, number])
  .sort((a, b) => b[1] - a[1])


  const sortedIds = allSortedIds.map((a) => a[0])
  .slice(0, 10);

console.log("highlight count this iteration", allSortedIds[0][1], maxHighlightCount)
  if (allSortedIds[0][1] > maxHighlightCount ) {
    maxHighlightCount = allSortedIds[0][1]

    console.log("maxHighlightCount", maxHighlightCount)
    renderTaggedEvents = taggedEvents
    if (
  sortedIds.length !== taggedEventIds.length ||
  sortedIds.some((id, i) => id !== taggedEventIds[i])
) {
    console.log("sorting hightlights !!!")
  taggedEventIds = sortedIds;
}
// taggedEventIds = sortedIds;

  }



}


</script>

<div class="">

    {#each taggedEventIds as articleId, i}
    {#if renderTaggedEvents[articleId]}
  <ArticleCardWithHighlights
  highlights={renderTaggedEvents[articleId]}
  highlightsFrom={pubkeys}
  {maxHighlightCountToShow}
  {skipHighlighter}

/>
{/if}
    {/each}

  <!-- test -->
</div>
