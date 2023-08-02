<script lang="ts">
    import { openModal } from 'svelte-modals'

    import Relays from "$lib/icons/Relays.svelte";
    import RelaySetNavigatorModal from '$lib/modals/relays/RelaySetNavigatorModal.svelte';
    import { currentRelaySet } from '../RelaySets/index';

    import { onMount } from 'svelte';
    import type NDKRelayList from '$lib/ndk-kinds/lists/relay-list';

    let activeRelaySet: NDKRelayList | null;

    onMount(() => {
        activeRelaySet = currentRelaySet();
        // openModal(RelaySetNavigatorModal)
    });
</script>

<li class="border-b border-base-300 -mx-2 px-2">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a class="
        flex flex-row gap-4 items-center text-lg rounded-b-none
    " on:click={() => {openModal(RelaySetNavigatorModal) }}>
        <Relays />
        {#if activeRelaySet?.name}
            {activeRelaySet.name}
        {:else}
            Default Relays
        {/if}
    </a>
</li>