<script lang="ts">
    import { idFromNaddr } from "$lib/utils";
    import List from "./list.svelte";
    import { lists } from "$lib/stores/list";
    import type NDKList from "$lib/ndk-kinds/lists";
    import { page } from "$app/stores";
    import { derived, type Readable } from "svelte/store";
    import ndk from "$lib/stores/ndk";
    import { pageTitle, pageSubtitle } from "$lib/store";

    let naddr: string;
    let prevNaddr: string;

    $: naddr = $page.params.naddr;

    let list: Readable<NDKList | undefined>;

    $: {
        $pageTitle = undefined;
        $pageSubtitle = undefined;
    }

    $: if (naddr !== prevNaddr || !list) {
        prevNaddr = naddr;

        const id = idFromNaddr(naddr);

        list = derived(lists, ($lists) => {
            const list = $lists.get(id);
            if (!list) return undefined;

            // de-duplicate list items
            const tags = [...new Set(list.tags)];
            list.tags = tags;
            list.ndk = $ndk;

            return list;
        });
    }
</script>

{#key naddr}
    {#if $list}
        <List list={$list} />
    {/if}
{/key}