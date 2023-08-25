<script lang="ts">
    import { currentUser } from '$lib/store';
    import LoginDropdown from '$lib/ndk-svelte-components/LoginDropdown.svelte';
    import UserDropdown from './UserDropdown.svelte';
</script>

{#if $currentUser}
    <UserDropdown />
{:else}
    <LoginDropdown />
{/if}
