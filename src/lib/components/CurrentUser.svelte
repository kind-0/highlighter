<script lang="ts">
    import { currentUser } from '$lib/store';
    import ndk from '$lib/stores/ndk';

    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';

    import { createMenu } from '@grail-ui/svelte';
	import { fade } from 'svelte/transition';

    import { logout } from '$lib/currentUser';

	const { useTrigger, triggerAttrs, useMenu, menuAttrs, itemAttrs, open } = createMenu();
</script>

{#if $currentUser}
    <div class="relative inline-block text-left">
        <button class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-10 h-10 flex flex-row gap-2"  use:useTrigger {...$triggerAttrs}>
            <Avatar
                ndk={$ndk}
                user={$currentUser}
                class="
                    w-10 h-10 border-2 border-slate-200 rounded-full
                "
            />

            <Name
                ndk={$ndk}
                user={$currentUser}
            />
        </button>

        {#if $open}
            <ul transition:fade={{duration:100}} use:useMenu {...$menuAttrs} class="menu">
                <li><button on:click={logout}>Logout</button></li>
            </ul>
        {/if}
    </div>
{:else}
    No User
{/if}

<style lang="postcss">
	.menu {
		@apply absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;
	}

    li {
        @apply block px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 text-sm;
    }
</style>
