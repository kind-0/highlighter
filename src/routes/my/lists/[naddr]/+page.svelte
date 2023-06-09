<script lang="ts">
    import { page } from "$app/stores";
    import BookmarkListInterface from "$lib/interfaces/bookmark-list";
    import { currentUser } from "$lib/store";
    import type { NDKSubscription } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/stores/ndk";
    import List from "./list.svelte";
    import { onDestroy } from "svelte";
    import NDKList from "$lib/ndk-kinds/lists";
    import NDKRelayList from "$lib/ndk-kinds/lists/relay-list";

    let naddr: string;
    let activeSubs: NDKSubscription[] = [];
    let lists, list: NDKList | undefined;

    $: if (naddr !== $page.params.naddr && $currentUser) {
        // cleanup
        list = undefined;
        removeSubscription();

        // load stuff
        naddr = $page.params.naddr;

        const opts = { naddr };
        lists = BookmarkListInterface.load(opts);
        // activeSubs = BookmarkListInterface.startStream(opts);
    }

    $: if ($lists && $lists?.length > 0 && list?.id !== $lists[0].id) {
        const payload = JSON.parse($lists[0].event)

        if (payload.kind === 30022) {
            list = new NDKRelayList($ndk, payload);
        } else {
            list = new NDKList($ndk, payload);
        }

        list.ndk = $ndk;
    }

    function removeSubscription() {
        for (const sub of activeSubs) {
            sub.stop();
        }
    }

    onDestroy(() => {
        removeSubscription();
    });
</script>

{#key naddr}
    {#if list}
        <List {list} />
    {/if}
{/key}