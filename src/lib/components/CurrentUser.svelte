<script lang="ts">
    import { currentUser } from '$lib/store';
    import ndk from '$lib/stores/ndk';

    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';

    import { logout } from '$lib/currentUser';
    import LoginDropdown from '$lib/ndk-svelte-components/LoginDropdown.svelte';
</script>

{#if $currentUser}
    <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <Avatar
                ndk={$ndk}
                user={$currentUser}
                class="
                    w-10 h-10 border-2 border-base-300 rounded-full
                "
            />
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="#" on:click={logout}>Logout</a></li>
        </ul>
    </div>
{:else}
    <LoginDropdown />
{/if}

<style lang="postcss">
    .menu {
        @apply absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-base-300 text-base-content py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;
    }

    li {
        @apply block px-4 py-2 font-medium  hover:bg-base-200 hover:text-gray-800 text-sm;
    }

    li a:hover {
        @apply !bg-transparent;
    }
</style>
