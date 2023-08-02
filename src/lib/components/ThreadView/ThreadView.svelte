<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from '$lib/stores/ndk';
    import { derived } from 'svelte/store';
    import { fade } from 'svelte/transition';

    export let event: NDKEvent;

    const replies = $ndk.storeSubscribe({
        kinds: [1],
        ...event.filter()
    }, { closeOnEose: false, groupableDelay: 100 });

    const actualReplies = derived(replies, ($replies) => {
        return $replies.filter((r: NDKEvent) => isReply(r));
    });

    function isReply(e: NDKEvent): boolean {
        // check if event is tagged with a reply marker
        const opTagId = event.tagId();

        const replyMarker = e.tags.find(tag => {
            return (
                tag[1] === opTagId &&
                tag[3] === 'reply'
            );
        })

        if (replyMarker) return true;

        // check if the event has reply markers
        const hasReplyMarker = e.tags.find(tag => tag[3] === 'reply');

        if (hasReplyMarker) return false;

        return true;
    }
</script>

<div class="flex flex-col gap-4" transition:fade={{ duration: 500 }}>
    <GenericEventCard {event} />

    {#if $actualReplies?.length > 0}
        <div class="flex flex-col gap-4 pl-12">
            {#each $actualReplies as reply}
                <svelte:self event={reply} />
            {/each}
        </div>
    {/if}
</div>