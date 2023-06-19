<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';
    import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';
    import { pwaInfo } from 'virtual:pwa-info'; 

    let prevCurrentUser: string | undefined = undefined;

    onMount(async () => {
        try {
            $ndk.connect();
        } catch (e) {
            console.error(`layout error`, e);
        }
    });

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

    $: if ($currentUser && $currentUser?.npub !== prevCurrentUser) {
        prevCurrentUser = $currentUser?.npub;

        // added
        const cachedFollows = localStorage.getItem('currentUserFollowPubkeysStore');
        if (cachedFollows) {
            $currentUserFollowPubkeysStore = JSON.parse(cachedFollows);
        }
        // end of added

        fetchFollowers();
    }
</script>

  
<svelte:head> 
 	{@html webManifestLink} 
</svelte:head>

<slot />

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
