<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { onMount } from 'svelte';

    onMount(async () => {
        try {
            $ndk.connect();
        } catch (e) {
            console.error(`layout error`, e);
        }
    });
</script>

<slot />

<style>
    @tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>