<script lang="ts">
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';

    import CollapsibleCard from '../../components/CollapsibleCard.svelte';
    import type NDKList from '$lib/ndk-kinds/lists/index.js';

    export let list: NDKList;
    export let tags: NDKTag[];
    export let currentUserPubkeys: string[] = [];

    async function onRemoveItem(e: CustomEvent) {
        const { tag } = e.detail;
        const tagFilter = (t: NDKTag) => !(t[0] === tag[0] && t[1] === tag[1]);

        // Remove the tag from the list
        list.tags = list.tags.filter(tagFilter);

        list.created_at = Math.floor(Date.now() / 1000);

        if (list.content?.length > 0) {
            let tags;

            try {
                tags = JSON.parse(list.content);
                if (!tags || !tags) tags = [];

                tags = tags.filter(tagFilter);

                list.content = JSON.stringify(tags);
                await list.encrypt($currentUser!);
            } catch (e) {
            }
        }

        await list.sign();
        await list.publish();
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
    {#each tags as tag, i (i)}
        {#if shouldDisplayTag(tag)}
            <CollapsibleCard
                {tag}
                on:removeItem={onRemoveItem}
                skipTitle={false}
                skipFooterForPubkeys={currentUserPubkeys}
            />
        {/if}
    {/each}
</div>