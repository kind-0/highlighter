<script lang="ts">
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';

    import EventCard from '$lib/components/events/card.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { onDestroy, onMount } from 'svelte';

    export let event: NDKEvent;
    export let skipFooter = false;
    export let skipButtons = false;
    export let skipReplies = false;
    export let expandReplies = true

    let replies: NDKEventStore<NDKEvent>;

    onMount(() => {
        if (!skipReplies) {
            replies = $ndk.storeSubscribe({ kinds: [1], '#e': [event.id] });
        }
    });

    onDestroy(() => {
        if (replies) replies.unsubscribe();
    });
</script>

<EventCard
    {event}
    skipHeader={true}
    {skipFooter}
    {skipButtons}
    {skipReplies}
    replies={($replies||[])}
    {expandReplies}
>
</EventCard>