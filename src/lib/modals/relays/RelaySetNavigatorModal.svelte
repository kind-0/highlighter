<script lang="ts">
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import { getListsFromFilter, sortedListWithKind } from '$lib/stores/list';
    import { NDKKind } from '$lib/ndk-kinds';
    import RelaySetNavigatorCard from '$lib/components/Sidebar/RelaySetNavigatorCard.svelte';
    import NDKRelayList from '$lib/ndk-kinds/lists/relay-list';
    import ndk, { defaultRelays } from '$lib/stores/ndk';
    import { currentRelaySet } from '$lib/components/RelaySets';
    import { onDestroy } from 'svelte';
    import { currentUser, currentUserFollowPubkeys } from '$lib/store';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';

    const relaySetLists = sortedListWithKind(NDKKind.RelayList);

    let listSub: NDKSubscription | undefined;

    /**
     * The number of follows this listsub has been created with
     */
    let listSubFollowCount: number | undefined;

    // If we have the list of follows
    $: if ($currentUserFollowPubkeys && listSubFollowCount !== $currentUserFollowPubkeys.length) {
        if (listSub) listSub.stop();
        listSubFollowCount = $currentUserFollowPubkeys.length;
        listSub = getListsFromFilter({
            kinds: [NDKKind.RelayList as number],
            authors: $currentUserFollowPubkeys,
            limit: 50,
        })
    }

    // If the user is not logged in
    $: if (!$currentUser && !listSub) {
        listSubFollowCount = undefined;
        listSub = getListsFromFilter({
            kinds: [NDKKind.RelayList as number],
            limit: 50,
        })
    }

    onDestroy(() => {
        if (listSub) listSub.stop();
    })

    // Create a list for the default
    const defaultRelaySet = new NDKRelayList($ndk);
    defaultRelaySet.name = 'Default Relays';
    defaultRelaySet.description = 'A boring default';
    defaultRelays.forEach(relay => defaultRelaySet.tags.push(['r', relay]));

    // Get current relay set
    const current = currentRelaySet()
</script>

<ModalWrapper
    title="Relay Collections"
    subtitle="Control your experience by navigating different relay collections"
>
    <div class="grid sm:grid-cols-2 gap-4">
        {#if current}
            <RelaySetNavigatorCard relaySet={current} />
        {/if}

        {#if current?.sig}
            <!-- Only show the default if the current one is not already a non-published event (thus, being a saved default) -->
            <RelaySetNavigatorCard relaySet={defaultRelaySet} />
        {/if}

        {#if $relaySetLists}
            {#each $relaySetLists as relaySet (relaySet.id)}
                {#if relaySet.encode() !== current?.encode()}
                    <RelaySetNavigatorCard relaySet={NDKRelayList.from(relaySet)} />
                {/if}
            {/each}
        {/if}
    </div>
</ModalWrapper>