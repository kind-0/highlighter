<script lang="ts">
    import { page } from '$app/stores';
    import { currentScope, currentUser } from '$lib/store';
    import { userFollows } from '$stores/session';
    import MainWithRightSidebar from '$lib/layouts/MainWithRightSidebar.svelte';
    import MenuItem from '$components/sidebars/MenuItem.svelte';
    import PopularShelves from '$lib/components/lists/PopularShelves.svelte';
    import ndk from '$lib/stores/ndk';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import NDKList from '$lib/ndk-kinds/lists';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { getHighlights } from '$lib/stores/highlights';
    import type { NDKFilter, NDKSubscription } from '@nostr-dev-kit/ndk';
    import { onDestroy } from 'svelte';

    let subscribed = false;
    let highlightsSub: NDKSubscription;
    let subscribedScopeLabel: string;

    function getHighlightsWithFilter(): NDKSubscription {
        const filter: NDKFilter = { limit: 100 };
        if ($currentScope?.pubkeys) {
            filter.authors = $currentScope.pubkeys;
        }
        return getHighlights(filter);
    }

    $: if (!subscribed) {
        subscribed = true;
        subscribedScopeLabel = $currentScope.label;
        highlightsSub = getHighlightsWithFilter();
    }

    $: if (subscribed && $currentScope.label !== subscribedScopeLabel) {
        highlightsSub.stop();
        subscribedScopeLabel = $currentScope.label;
        highlightsSub = getHighlightsWithFilter();
    }

    onDestroy(() => {
        if (highlightsSub) {
            highlightsSub.stop();
        }
    });

    let fetchScopePromise: Promise<void> | undefined = undefined;
    let list: NDKList | undefined;

    $: if ($page.params.scope !== $currentScope.id) {
        $currentScope.id = $page.params.scope;

        switch ($page.params.scope) {
            case 'personal':
                if ($currentUser) {
                    $currentScope.pubkeys = [$currentUser.hexpubkey()];
                    $currentScope.label = $page.params.scope;
                }

                break;
            case 'network':
                if ($userFollows) {
                    $currentScope.pubkeys = Array.from($userFollows);
                    $currentScope.label = $page.params.scope;
                }
                break;
            case 'global':
                $currentScope.pubkeys = undefined;
                $currentScope.label = $page.params.scope;
                break;
        }

        if ($page.params.scope.startsWith('naddr')) {
            // scope is a list of people
            fetchScopePromise = new Promise(resolve => {
                $ndk.fetchEvent($page.params.scope).then((event: NDKEvent) => {
                    if (event) {
                        list = NDKList.from(event);
                        const pubkeys = list.getMatchingTags('p').map(t => t[1]);

                        $currentScope.pubkeys = pubkeys;
                        $currentScope.label = list.name;

                        resolve();
                    }
                })
            })
        }
    }
</script>

<MainWithRightSidebar>
    {#if $page.params.scope === 'network'}
        {#if $userFollows === undefined}
            <slot />
        {:else}
            <slot />
        {/if}
    {:else if fetchScopePromise}
        {#await fetchScopePromise}
            Loading scope
        {:then}
            <PageTitle
                title={$currentScope.label}
                subtitle={list?.description}
            />

            <slot />
        {/await}
    {:else}
        <slot />
    {/if}

    <div slot="right-sidebar">
        <div class="flex flex-col items-center gap-8">
            <ul class="menu bg-base-200 w-full rounded-box">
                <li class="menu-title">TOPICS</li>

                <MenuItem href="/highlights/t/bitcoin">
                    <img src="https://abs.twimg.com/hashflags/Bitcoin_evergreen/Bitcoin_evergreen.png" style="width: 1.2em; vertical-align: -20%; margin-right: 0.075em; height: 1.2em; margin-left: 2px; display: inline-block;">
                    Bitcoin
                </MenuItem>

                <MenuItem href="/highlights/t/ai">
                    Artificial Intelligence
                </MenuItem>

                <MenuItem href="/highlights/t/regenerative-agriculture">
                    Regenerative Agriculture
                </MenuItem>
            </ul>

            <PopularShelves />
        </div>
    </div>
</MainWithRightSidebar>

