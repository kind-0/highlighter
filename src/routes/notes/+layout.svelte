<script lang="ts">
    import { page } from '$app/stores';
    import Sidebar from "../lists/components/Sidebar/Sidebar.svelte";
    import WithLeftSidebar from "$lib/layouts/WithLeftSidebar.svelte";
    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/store';
    import { getLongForms } from '$lib/stores/long-form';
    import { onDestroy } from 'svelte';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';

    let readyToRender = true;

    $: if ($currentUser && $ndk.signer) {
        readyToRender = true;
    }

    const pagesWithHiddenSidebar = [
        '/notes/new',
        '/notes/[naddr]/edit',
    ];

    let forceHideSidebar = false;

    $: forceHideSidebar = pagesWithHiddenSidebar.includes($page.route.id);

    let subscribed = false;
    let encryptedNotesSub: NDKSubscription | undefined = undefined;

    $: if (!subscribed && $currentUser) {
        subscribed = true;
        encryptedNotesSub = getLongForms($currentUser);
    }

    onDestroy(() => {
        if (encryptedNotesSub) {
            encryptedNotesSub.stop();
        }
    });
</script>

<WithLeftSidebar
    {forceHideSidebar}
    containerClass={!forceHideSidebar ? 'max-w-7xl' : ''}
>
    <div class="flex-1" slot="sidebar">
        <Sidebar isHiddenSidebar={forceHideSidebar} />
    </div>

    {#if readyToRender}
        <slot />
    {:else}
        Loading
    {/if}
</WithLeftSidebar>