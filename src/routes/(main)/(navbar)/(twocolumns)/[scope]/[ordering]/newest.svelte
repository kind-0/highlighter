<script lang="ts">
    import { currentUser, currentUserFollowPubkeys } from '$lib/store';
    import HighlightList from '$lib/components/HighlightList.svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
    import NDKHighlight from '$lib/ndk-kinds/highlight';
    import type { Writable } from 'svelte/store';
    import type { NDKEventStore } from '$lib/stores/ndk';
    import ndk from '$lib/stores/ndk';

    export let scope: string;
    let prevScope: string;

    let filter: NDKFilter | undefined = undefined;

    let items: NDKEventStore<NDKHighlight>;

    $: if (prevScope !== scope) {
        prevScope = scope;

        if (items) {
            items.unsubscribe();
        }

        let pubkeys: string[] | undefined;

        switch (scope) {
            case 'personal':
                pubkeys = [$currentUser?.hexpubkey()!];
                break;
            case 'network':
                pubkeys = $currentUserFollowPubkeys!;
                break;
        }

        filter = { authors: pubkeys, kinds: [9802 as number], limit: 20 };

        items = $ndk.storeSubscribe(filter);
    }
</script>

{#key filter}
    {#if filter}
        <code>newest</code>
        <HighlightList items={$items.map(e => NDKHighlight.from(e))} />
    {/if}
{/key}