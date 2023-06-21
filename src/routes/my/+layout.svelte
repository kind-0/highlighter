<script lang="ts">
    import LogoIcon from '$lib/icons/Logo.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';

    import Sidebar from '$lib/components/my/Sidebar.svelte';

    import { currentUser } from '$lib/store';
    import { getLongForms } from '$lib/stores/long-form';

    import { Modals, closeModal } from 'svelte-modals';
    import { fade } from 'svelte/transition';

    import { NavHamburger } from 'flowbite-svelte';

    import ndk from '$lib/stores/ndk';

    let readyToRender = true;

    $: if ($currentUser && $ndk.signer) {
        readyToRender = true;
    }

    let isOpen = false;

    let subscribed = false;
    let listSub;

    $: if (!subscribed && $currentUser) {
        subscribed = true;
        listSub = getLongForms($currentUser);
    }
</script>

<div class="h-full pb-48">
    <div
        class="
        bg-beige-150
        px-4
        fixed inset-y-0 z-50 sm:z-auto flex w-72 flex-col
        min-h-screen
        pb-4
        {isOpen ? 'flex shadow-lg' : 'hidden sm:block'}
    "
    >
        <button on:click={() => { isOpen = false; }} class="
            absolute top-2 right-2
            sm:hidden
        ">
            <CloseIcon />
        </button>

        <Sidebar />
    </div>

    <div
        class="
        flex flex-row items-center justify-between
        sm:hidden
        {isOpen ? 'opacity-10' : ''}
    "
    >
        <div class="flex flex-row gap-2">
            <NavHamburger
                on:click={() => {
                    isOpen = true;
                }}
            />
            <div class="flex h-16 shrink-0 items-center flex-row gap-2 font-bold tracking-wider text-zinc-800">
                <span class="w-6 h-6"><LogoIcon /></span>
                <a href="/my" class="flex flex-row">
                    <span class="text-zinc-900 uppercase">Highlighter</span>
                </a>
            </div>
        </div>
    </div>

    <main
        class="
        py-10 sm:pl-72 h-full pb-48
        {isOpen ? 'opacity-10' : ''}
    "
    >
        <div class="px-4 sm:px-6 lg:px-8 h-full">
            <div class="flex flex-col gap-6 max-h-screen">
                {#if readyToRender}
                    <slot />
                {:else}
                    Loading
                {/if}
            </div>
        </div>
    </main>
</div>

<Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} transition:fade>/></div>
</Modals>

<style>
    .backdrop {
        position: fixed;
        /* z-index: 0; */
        top: 0;
        bottom: 0;
        right: 0;
        backdrop-filter: blur(0.15rem);
        left: 0;
        background: rgba(0, 0, 0, 0.5);
    }
</style>
