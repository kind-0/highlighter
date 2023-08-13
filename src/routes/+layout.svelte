<script lang="ts">
    import ndk, { bunkerNDK } from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';
    import { login } from '$lib/utils/login';
    import '../app.postcss';
    import { Modals, closeModal } from 'svelte-modals'
    import { fade } from 'svelte/transition'
    import { pwaInfo } from 'virtual:pwa-info';
    import "@fontsource/lora";
    import Loading from '$lib/components/Loading.svelte';
    import { user, prepareSession } from '$stores/session';
    import { page } from '$app/stores';

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

    let prevCurrentUser: string | undefined = undefined;

    let sessionPreparationStarted = false;
    let mounted = false;

    login($ndk, $bunkerNDK).then((user) => {
        $currentUser = user;
        $user = $currentUser;
    })

    onMount(async () => {
        try {
            $ndk.connect();
            console.log($currentUser);
            mounted = true;
        } catch (e) {
            console.log('here')
            console.error(`layout error`, e);
            mounted = true;
        }
    });

    $: if ($currentUser && $currentUser?.npub !== prevCurrentUser) {
        prevCurrentUser = $currentUser?.npub;

        const cachedFollows = localStorage.getItem('currentUserFollowPubkeysStore');
        if (cachedFollows) {
            $currentUserFollowPubkeysStore = JSON.parse(cachedFollows);
        }
    }

    let loading: boolean = false;

    $: if (mounted && !!$currentUser && !sessionPreparationStarted) {
        sessionPreparationStarted = true;
        if (true) {
            loading = true;
            prepareSession().then(() => {
                loading = false;
            })
        } else {
            prepareSession();
        }
    }

    let shouldShowLoadingScreen = false;

    $: shouldShowLoadingScreen = $page.url.pathname !== '/';

    // setTimeout(() => { loading = false }, 5000 );

</script>

<svelte:head>
    {@html webManifestLink}
</svelte:head>

{#if mounted}
    {#if loading && shouldShowLoadingScreen}
        <div transition:fade>
            <Loading on:loaded={() => loading = false } />
        </div>
    {:else}
        <div transition:fade>
            <slot />
        </div>
    {/if}
{/if}

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