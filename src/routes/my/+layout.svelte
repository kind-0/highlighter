<script lang="ts">
    import type { NDKEventStore } from '$lib/stores/ndk.ts';
    import LogoIcon from '$lib/icons/Logo.svelte';
    import HighlightIcon from '$lib/icons/Highlight.svelte';
    import BookmarkIcon from '$lib/icons/Bookmark.svelte';
    import NoteIcon from '$lib/icons/MyHighlights.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';

    import RelaysButton from '$lib/components/RelaysButton.svelte';

    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';
    import NavigationButton from './components/navigation/Button.svelte';

    import { currentUser } from '$lib/store';
    import ndk from '$lib/stores/ndk';
    import { Modals, closeModal } from 'svelte-modals';
    import { fade } from 'svelte/transition';

    import { onMount } from 'svelte';
    import ListItem from './components/navigation/list-item.svelte';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import LoginButton from '$lib/ndk-svelte-components/LoginButton.svelte';
    import { NavHamburger } from 'flowbite-svelte';

    import { NDKListKinds } from '$lib/ndk-kinds';
    import NDKList from '$lib/ndk-kinds/lists';

    import { lists, sortedLists, getLists } from '$lib/stores/list';

    let subscribed = false;
    let listSub;

    $: if (!subscribed && $currentUser) {
        subscribed = true;
        listSub = getLists($currentUser);
    }

    function isTopLevel(thisList: NDKList) {
        console.log('this list id', thisList.id);
        for (const _list of $sortedLists) {
            // check if a list has _list's id in its tags
            // console.log('list tags', _list.tags);
        
console.log("_list.tags ids", _list.tags)
            const referenced = _list.tags.find((t) => t[1] === thisList.id);

            // console.log("referenced", referenced)
            const notReferencedByItself = _list.tags.find((t) => t[1] !== _list.id); // that is not itself
            // console.log("notReferencedByItself", notReferencedByItself)

            if (referenced && notReferencedByItself) {
console.log("not at top level ")
                return false;
            }
        }

        return true;
    }

    // $: {
    // 	_bookmarkLists = (($bookmarkLists || []) as NDKList[]).sort((a, b) => {
    // 		return b.createdAt - a.createdAt;
    // 	});

    //     _bookmarkLists = _bookmarkLists.filter(l => !l.title.startsWith('chats/'));
    // }

    let isOpen = false;
</script>

<div class="h-full pb-48">
    <div
        class="
        fixed inset-y-0 z-50 sm:z-auto flex w-72 flex-col
        max-h-screen
        {isOpen ? 'flex shadow-lg' : 'hidden sm:block'}
    "
    >
        <button
            on:click={() => {
                isOpen = false;
            }}
            class="
            absolute top-2 right-2
            sm:hidden
        "
        >
            <CloseIcon />
        </button>

        <div
            class="
            grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-2
            h-full
            sm:flex
        "
        >
            <div class="flex h-16 shrink-0 items-center justify-between flex-row gap-2 font-bold tracking-wider text-zinc-800">
                <div class="flex flex-row items-center gap-2">
                    <span class="w-6 h-6 overflow-clip"><LogoIcon /></span>
                    <a href="/my" class="flex flex-row">
                        <span class="text-zinc-400 font-light">my</span>
                        <span class="text-zinc-900 uppercase">Highlighter</span>
                    </a>
                </div>

                <RelaysButton iconOnly={true} />
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <nav
                class="
                flex flex-1 flex-col
            "
                on:click={() => {
                    isOpen = false;
                }}
            >
                <ul class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul class="-mx-2 space-y-1">
                            <li>
                                <NavigationButton route="/my/highlights">
                                    <HighlightIcon klass="w-6 h-6" />
                                    Highlights
                                </NavigationButton>

                                <NavigationButton route="/my/lists">
                                    <BookmarkIcon klass="w-6 h-6" />
                                    Lists
                                </NavigationButton>

                                <NavigationButton route="/my/notes">
                                    <NoteIcon class="w-6 h-6" />
                                    Private Notes
                                </NavigationButton>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <div class="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
                        <ul class="-mx-2 mt-2 space-y-1">
                            {#each $sortedLists ?? [] as item}
                                {#if isTopLevel(item)}
                                    <ListItem {item} />
                                {/if}
                            {/each}
                        </ul>
                    </li>

                    {#if !$currentUser}
                        <li class="w-full">
                            <LoginButton />
                        </li>
                    {:else}
                        <li class="-mx-6 mt-auto">
                            <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                <span class="sr-only">Your profile</span>
                                {#if $currentUser}
                                    <Avatar pubkey={$currentUser.hexpubkey()} klass="h-8 w-8 " />
                                    <span aria-hidden="true">
                                        <Name pubkey={$currentUser.hexpubkey()} />
                                    </span>
                                {/if}
                            </a>
                        </li>
                    {/if}
                </ul>
            </nav>
        </div>
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
                    <span class="text-zinc-400 font-light">my</span>
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
                <slot />
            </div>
        </div>
    </main>
</div>

<Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} transition:fade>/></div></Modals
>

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
