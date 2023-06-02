<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { onMount } from 'svelte';

    onMount(async () => {
        await $ndk.connect();
    });
</script>

<slot />

<style>
    @tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>