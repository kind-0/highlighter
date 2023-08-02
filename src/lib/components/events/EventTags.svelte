<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    export let event: NDKEvent;
    export let urlPrefix: string = '/highlights/t/'

    let tags = event.getMatchingTags('t').map(t => t[1]);
</script>

{#if tags.length > 0}
    <div class="text-base whitespace-normal text-left">
        {#each tags as topicTag}
            <a
                href={urlPrefix + topicTag}
                class="btn btn-neutral btn-outline btn-xs inline-flex mr-2 mb-1"
            >#{topicTag}</a>
        {/each}
    </div>
{/if}