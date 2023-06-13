<script lang="ts">
    import { idFromNaddr } from "$lib/utils";
    import List from "./list.svelte";
    import { lists } from "$lib/stores/list";
    import type NDKList from "$lib/ndk-kinds/lists";
    import { page } from "$app/stores";

    let naddr: string;
    let prevNaddr: string;

    $: naddr = $page.params.naddr;

    let list: NDKList | undefined;

    $: if (naddr !== prevNaddr || !list) {
        prevNaddr = naddr;
        list = $lists.get(idFromNaddr(naddr));
    }


</script>

{#key naddr}
    {#if list}
        <List {list} />
    {/if}
{/key}