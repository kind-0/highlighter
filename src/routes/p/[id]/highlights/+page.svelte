<script lang="ts">
	import { type NDKEventStore } from '$lib/stores/ndk';
    import { page } from "$app/stores";
    import MainWithRightSidebar from "$lib/layouts/MainWithRightSidebar.svelte";
    import { NDKUser } from "@nostr-dev-kit/ndk";
    import HighlightList from "$lib/components/HighlightList.svelte";
    import ndk from "$lib/stores/ndk";
    import NDKHighlight from "$lib/ndk-kinds/highlight";
    import { NDKKind } from "$lib/ndk-kinds";
    import { onDestroy, onMount } from "svelte";

    const { npub } = $page.data;

    let user: NDKUser;
    let highlights: NDKEventStore<NDKHighlight> | undefined;

    onMount(() => {
        user = new NDKUser({npub});

        highlights = $ndk.storeSubscribe({
            kinds: [NDKKind.Highlight as number],
            authors: [user.hexpubkey()]
        }, undefined, NDKHighlight);
    });

    onDestroy(() => {
        if (highlights) highlights.unsubscribe();
    });
</script>

<MainWithRightSidebar>
    {#if $highlights}
        <HighlightList items={$highlights} />
    {/if}
</MainWithRightSidebar>