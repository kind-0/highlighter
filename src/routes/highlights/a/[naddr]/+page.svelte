<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import ndk from '$lib/stores/ndk';
    import NDKList from '$lib/ndk-kinds/lists';
    import { page } from '$app/stores';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import Avatar from '$lib/components/Avatar.svelte';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';
    import MainWithRightSidebar from '$lib/layouts/MainWithRightSidebar.svelte';
    import ListsWithSimilarItems from '$lib/components/lists/ListsWithSimilarItems.svelte';
    import PopularShelves from '$lib/components/lists/PopularShelves.svelte';

    let naddr: string;
    $: naddr = $page.params.naddr;

    let prevNaddr: string;

    let list: NDKList | undefined;

    $: if (naddr && naddr !== prevNaddr) {
        prevNaddr = naddr;
        $ndk.fetchEvent(naddr).then((event) => {
            if (event) {
                list = NDKList.from(event);
            }
        });
    }

    function makeUnique(items: [string, string][]) {
        const seen: Set<string> = new Set();
        const unique: [string, string][] = [];

        for (const item of items) {
            if (!seen.has(item[1])) {
                unique.push(item);
                seen.add(item[1]);
            }
        }

        return unique;
    }
</script>

{#key naddr}
    <MainWithRightSidebar>
        {#if list}
            <PageTitle
                title={list.name}
                subtitle={list.description}
            />
            <a href="/p/{list.author.npub}/lists" class="text-xs flex flex-row gap-2 items-center">
                <Avatar user={list.author} size="small" />

                <span>
                    Curated by
                    <span class="font-semibold">
                        <Name ndk={$ndk} user={list.author} />
                    </span>
                </span>
            </a>

            <div class="flex flex-col gap-2.5">
                {#each makeUnique(list.items) as item}
                    <GenericEventCard
                        id={item[1]}
                        draggable={false}
                    />
                {/each}
            </div>
        {/if}

        <div slot="right-sidebar">
            {#if list}
                <ListsWithSimilarItems
                    list={list}
                    items={list?.items ?? []}
                />
            {/if}

            <PopularShelves />
        </div>
    </MainWithRightSidebar>
{/key}