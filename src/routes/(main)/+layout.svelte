<script lang="ts">
    import { currentScope, currentUser, type ScopeSelection } from '$lib/store';
    import { getHighlights } from '$lib/stores/highlights';
    import type { NDKFilter, NDKSubscription } from '@nostr-dev-kit/ndk';
    import { onDestroy } from 'svelte';
    import { Modals, closeModal } from 'svelte-modals'
    import { fade } from 'svelte/transition'

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

    $: if (!subscribed && $currentUser) {
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
</script>

<div class="min-h-full">
    <slot />
</div>

<Modals>
    <div
        slot="backdrop"
        class="backdrop z-10 fixed"
        on:click={closeModal}
        transition:fade={{ duration: 100 }}>
    />
</Modals>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        backdrop-filter: blur(0.15rem);
        left: 0;
        background: rgba(0,0,0,0.50)
    }

    :global(div[role="tooltip"]) {
        background: #000000;
        color: #ffffff;
        border: 1px solid #e2e8f0;
    }
</style>