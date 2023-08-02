<script lang="ts">
    import type { NDKTag } from '@nostr-dev-kit/ndk';

    import CollapsibleCard from './CollapsibleCard.svelte';
    import type NDKList from '$lib/ndk-kinds/lists/index.js';
    import { processEvent } from '$lib/stores/list';

    export let list: NDKList;
    export let tags: NDKTag[];
    export let currentUserPubkeys: string[] = [];
    export let encrypted: boolean = false;

    async function onRemoveItem(index: number) {
        const listEvent = await list.removeItem(index, encrypted);
        await listEvent.sign();
        listEvent.publish();
        processEvent(listEvent);
    }

    function shouldDisplayTag(tag: NDKTag) {
        switch (tag[0]) {
            case 'a':
                const [kind] = tag[1].split(':');
                ['30023', '30000', '30001', '31023'].includes(kind);
            case 'e':
                return true;
            case 'p':
                return true;
            case 'r':
                return true;
        }
    }
</script>

<div class="flex flex-col gap-2.5">
    {#each tags as tag, i}
        {#if shouldDisplayTag(tag)}
            <CollapsibleCard
                {tag}
                on:removeItem={() => setTimeout(() => onRemoveItem(i), 100)}
                skipTitle={false}
                skipFooterForPubkeys={currentUserPubkeys}
            />
        {/if}
    {/each}
</div>