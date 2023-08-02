<script lang="ts">
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';

    import EventCard from "$lib/components/events/EventCard.svelte";
    import NoteContent from '$lib/components/events/content.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { onDestroy, onMount } from 'svelte';
    import Avatar from '../Avatar.svelte';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';
    import EventCardActions from '../events/EventCardActions.svelte';

    export let event: NDKEvent;
    export let skipFooter = false;
    export let skipButtons = false;
    export let skipReplies = false;
    export let skipHeader = false;
    export let expandReplies = true
    export let draggable = true;

    let replies: NDKEventStore<NDKEvent>;

    onMount(() => {
        if (!skipReplies) {
            replies = $ndk.storeSubscribe(
                { kinds: [1, 4], '#e': [event.id] },
                { closeOnEose: false }
            );
        }
    });

    onDestroy(() => {
        if (replies) replies.unsubscribe();
    });
</script>

<EventCard
    {event}
    {draggable}
    {skipHeader}
    {skipFooter}
    {skipButtons}
    {skipReplies}
    replies={($replies||[])}
    {expandReplies}
>
    <div slot="header" class="flex flex-row gap-2 items-center">
        <Avatar user={event.author} size="small" />
        <div class="text-xs">
            <Name ndk={$ndk} user={event.author} />
        </div>
    </div>

    <div class="flex-grow">
        <NoteContent note={event.content} tags={event.tags} />
    </div>

    <div slot="footer">
        {#if $$slots.leftFooter}
            <slot name="leftFooter" />
        {/if}
        <div class="flex flex-row items-center justify-end">
            <div>
                <EventCardActions {event} />
            </div>
        </div>
    </div>
</EventCard>