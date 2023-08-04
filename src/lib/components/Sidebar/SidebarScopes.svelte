<script lang="ts">
    import { sortedUserList } from '$lib/stores/list';
    import { derived } from 'svelte/store';
    import SectionTitle from './SectionTitle.svelte';
    import Link from './Link.svelte';

    let displayLimit = 200;

    const npubList = derived(sortedUserList, ($sortedUserList) => {
        return $sortedUserList.filter((list) => {
            // filter out mute list
            if (list.name === 'mute') { return false; }

            const pTags = list.items.filter((tag) => tag[0] === 'p');
            return pTags.length / list.items.length >= 0.6;
        });
    });
</script>

<ul class="flex flex-col gap-2 text-lg w-full items-end text-base-300-content">
    <Link href="/highlights/global/newest">
        Global
    </Link>
    <Link href="/highlights/network/newest">My Network</Link>
    <Link href="/highlights/personal/newest">My Network</Link>
    <Link href="/highlights/explore">Explore</Link>
</ul>

{#if $npubList && $npubList.length > 0}
    <div class="w-full">
        <SectionTitle title="Lists" />

        <ul class="flex flex-col gap-2 text-base w-full items-end text-base-300-content">
            {#each $npubList.slice(0, displayLimit) as list}
                <Link href={`/highlights/${list.encode()}/all`}>{list.name}</Link>
            {/each}

            {#if $npubList.length > displayLimit}
                <li>
                    <button class="btn btn-primary btn-link btn-sm" on:click={() => displayLimit = displayLimit * 1.25 + 4}>
                        Show more
                    </button>
                </li>
            {/if}
        </ul>
    </div>
{/if}

<style>
    a {
        @apply duration-300 transition-all cursor-pointer;
    }

    a:hover {
        @apply text-white;
    }
</style>
