<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';

    let prevCurrentUser: string | undefined = undefined;

    onMount(async () => {
        try {
            $ndk.connect();
        } catch (e) {
            console.error(`layout error`, e);
        }
    });

    $: if ($currentUser && $currentUser?.npub !== prevCurrentUser) {
        prevCurrentUser = $currentUser?.npub;
        console.log(`loading followers`);
        fetchFollowers();
    }
</script>

<slot />

<style>
    @tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>