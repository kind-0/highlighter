<script lang="ts">
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';

    import EventCard from '$lib/components/events/card.svelte';

    import { zapInvoiceFromEvent, type NDKEvent, type NDKZapInvoice, NDKUser } from '@nostr-dev-kit/ndk';
    import { onDestroy, onMount } from 'svelte';
    import { nicelyFormattedMilliSatNumber } from '$lib/utils';

    export let event: NDKEvent;
    export let skipFooter = false;
    export let skipButtons = false;
    export let skipReplies = false;
    export let expandReplies = true
    export let draggable = true;

    let modifiedEvent: NDKEvent = event;
    let zap: NDKZapInvoice;

    let replies: NDKEventStore<NDKEvent>;

    onMount(() => {
        zap = zapInvoiceFromEvent(event);

        if (zap) {
            modifiedEvent.author = new NDKUser({hexpubkey: zap.zappee});
        }

        if (!skipReplies) {
            replies = $ndk.storeSubscribe({ kinds: [1], '#e': [event.id] });
        }
    });

    onDestroy(() => {
        if (replies) replies.unsubscribe();
    });
</script>

{#if zap}
    <EventCard
        event={modifiedEvent}
        skipHeader={true}
        {skipFooter}
        {skipButtons}
        {skipReplies}
        {draggable}
        replies={($replies||[])}
        {expandReplies}
    >
            <div class="text-xl font-semibold">
                <span class="text-gray-500">⚡️ {nicelyFormattedMilliSatNumber(zap.amount)} sats zap</span>
            </div>

            <div class="text-gray-500">
                <span class="text-gray-500">{zap.comment}</span>
            </div>
    </EventCard>
{/if}