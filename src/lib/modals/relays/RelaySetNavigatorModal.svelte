<script lang="ts">
    import ModalWrapper from '$lib/components/ModalWrapper.svelte';
    import { getLists, getListsFromFilter, sortedListWithKind } from '$lib/stores/list';
    import { NDKKind } from '$lib/ndk-kinds';
    import RelaySetNavigatorCard from '$lib/components/Sidebar/RelaySetNavigatorCard.svelte';
    import NDKRelayList from '$lib/ndk-kinds/lists/relay-list';
    import ndk, { defaultRelays } from '$lib/stores/ndk';
    import { currentRelaySet } from '$lib/components/RelaySets';
    import { onDestroy } from 'svelte';

    const relaySetLists = sortedListWithKind(NDKKind.RelayList);

    const listSub = getListsFromFilter({
        kinds: [NDKKind.RelayList as number],
        limit: 50,
    })

    onDestroy(() => {
        listSub.stop();
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