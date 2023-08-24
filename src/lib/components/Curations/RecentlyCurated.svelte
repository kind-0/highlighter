<script lang="ts">
    import ndk from "$stores/ndk";
    import type { NDKFilter } from "@nostr-dev-kit/ndk";
    import CurationCard from "./CurationCard.svelte";

    export let filters: NDKFilter[] = [{}];

    const curations = $ndk.storeSubscribe(
        filters.map((filter) => {
            filter.kinds = [39802 as number];
            return filter;
        }),
    )
</script>

<div class="flex flex-row gap-4">
    {#each $curations as curation}
        <CurationCard {curation} />
    {/each}
</div>