<script lang="ts">
    import { page } from "$app/stores";
    import MainWithRightSidebar from "$lib/layouts/MainWithRightSidebar.svelte";
    import ndk from "$lib/stores/ndk";
    import PageTitle from "$lib/components/PageTitle.svelte";
    import NDKList from "$lib/ndk-kinds/lists";
    import Tags from '../../../../lists/[naddr]/tags.svelte';
    import ListsWithSimilarItems from "$lib/components/lists/ListsWithSimilarItems.svelte";

    const { naddr } = $page.params;

    let list: NDKList | undefined;

    const fetch = new Promise((resolve, reject) => {
        $ndk.fetchEvent(naddr).then((event) => {
            if (event) {
                list = NDKList.from(event);
                resolve(list);
            } else {
                reject("Unable to find list")
            }
        });
    });
</script>

<MainWithRightSidebar>
    {#await fetch then list}
        <PageTitle title={list.name} subtitle={list.description} />

        <Tags {list} tags={list.items} />
    {/await}

    <div slot="right-sidebar">
        {#if list}
            <ListsWithSimilarItems {list} items={list.items} />
        {/if}
    </div>
</MainWithRightSidebar>