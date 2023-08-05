<script lang="ts">
    import { openModal } from 'svelte-modals'

    import BookmarkIcon from '$lib/icons/Bookmark.svelte';
    import BookmarkModal from '$lib/modals/Bookmark.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';

    export let event: NDKEvent;

    $: tooltip = $currentUser ? 'Bookmark' : 'You are not logged in';
</script>

<div class="tooltip" data-tip={tooltip}>
    <button
        class="{$$props.class}"
        class:cursor-not-allowed={!$currentUser}
        on:click={() => { openModal(BookmarkModal, { event }) }}
    ><BookmarkIcon class="w-4 h-4" /></button>
</div>
