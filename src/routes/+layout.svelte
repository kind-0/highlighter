<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';
    import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';

    let prevCurrentUser: string | undefined = undefined;

    onMount(async () => {
        try {
            console.log(`connecting to ndk from layout`);
            $ndk.connect();
        } catch (e) {
            console.error(`layout error`, e);
        }
    });

    $: if ($currentUser && $currentUser?.npub !== prevCurrentUser) {
        prevCurrentUser = $currentUser?.npub;
        console.log(`loading followers`);

        // added
        const cachedFollows = localStorage.getItem('currentUserFollowPubkeysStore');
        if (cachedFollows) {
            $currentUserFollowPubkeysStore = JSON.parse(cachedFollows);
        }
        // end of added

        fetchFollowers();
    }

    $: console.log("currentUserFollowPubkeysStore updated", $currentUserFollowPubkeysStore)
</script>

<slot />

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
