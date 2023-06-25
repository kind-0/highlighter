<script lang="ts">
    import ndk, { bunkerNDK } from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';
    import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';
    import { getLists } from '$lib/stores/list';
    import { login } from '$lib/utils/login';

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

        // added
        const cachedFollows = localStorage.getItem('currentUserFollowPubkeysStore');
        if (cachedFollows) {
            $currentUserFollowPubkeysStore = JSON.parse(cachedFollows);
        }
        // end of added

        fetchFollowers();
    }
</script>

<slot />

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
