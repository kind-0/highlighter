<script lang="ts">
    import ndk, { bunkerNDK } from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';
    import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';
    import { getLists } from '$lib/stores/list';
    import { login } from '$lib/utils/login';
    import '../app.postcss';
    import { Modals, closeModal } from 'svelte-modals'
    import { fade } from 'svelte/transition'
    import { pwaInfo } from 'virtual:pwa-info';

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

    let prevCurrentUser: string | undefined = undefined;

    let subscribed = false;
    let listSub;

    $: if (!subscribed && $currentUser) {
        subscribed = true;
        listSub = getLists($currentUser);
    }

    onMount(async () => {
        try {
            $ndk.connect();
            $currentUser = await login($ndk, $bunkerNDK);
        } catch (e) {
            console.error(`layout error`, e);
        }
    });

    $: if ($currentUser && $currentUser?.npub !== prevCurrentUser) {
        prevCurrentUser = $currentUser?.npub;

        const cachedFollows = localStorage.getItem('currentUserFollowPubkeysStore');
        if (cachedFollows) {
            $currentUserFollowPubkeysStore = JSON.parse(cachedFollows);
        }

        fetchFollowers();
    }
</script>

<svelte:head>
    {@html webManifestLink}
</svelte:head>

<slot />

<Modals>
    <div
        slot="backdrop"
        class="backdrop z-10 fixed"
        on:click={closeModal}
        transition:fade={{ duration: 100 }}></div>
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
</style>