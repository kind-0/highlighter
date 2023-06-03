<script lang="ts">
    import LogoIcon from '$lib/icons/Logo.svelte';
    import HighlightIcon from '$lib/icons/Highlight.svelte';
    import BookmarkIcon from '$lib/icons/Bookmark.svelte';
    import NoteIcon from '$lib/icons/MyHighlights.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';

    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';
    import NavigationButton from './components/navigation/Button.svelte';

    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import { Modals, closeModal } from 'svelte-modals'
    import { fade } from 'svelte/transition'

    import BookmarkListInterface from '$lib/interfaces/bookmark-list';
    import { onMount } from 'svelte';
    import ListItem from './components/navigation/list-item.svelte';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import LoginButton from '$lib/ndk-svelte-components/LoginButton.svelte';
    import RoundedButton from '../(main)/components/RoundedButton.svelte';
    import { NavHamburger } from 'flowbite-svelte';

    let bookmarkLists, _bookmarkLists: App.BookmarkList[] = [];

    async function loadbookmarkLists() {
        const user = await $ndk.signer?.user();

		if (!user) {
            setTimeout(() => {
                loadbookmarkLists();
            }, 100);
            return;
		}

		const opts = { pubkeys: [user.hexpubkey()] };
		bookmarkLists = BookmarkListInterface.load(opts);
		return BookmarkListInterface.startStream(opts);
    }

    onMount(async () => {
        loadbookmarkLists();
    })

    function isTopLevel(_list: App.BookmarkList) {
        for (const list of _bookmarkLists) {
            // check if a list has _list's id in its tags
            const listEvent = new NDKEvent($ndk, JSON.parse(list.event));
            if (listEvent.tags.find(t => (
                t[1] === _list.id) && // if this list is referenced by another list
                t[1] !== listEvent.id // that is not itself
            )) {
                return false;
            }
        }

        return true;
    }

    $: {
		_bookmarkLists = (($bookmarkLists || []) as App.BookmarkList[]).sort((a, b) => {
			return b.createdAt - a.createdAt;
		});

        _bookmarkLists = _bookmarkLists.filter(l => !l.title.startsWith('chats/'));

		_bookmarkLists = _bookmarkLists;
	}

    let isOpen = false;
</script>

<div class="h-full pb-48">
    <div class="
        fixed inset-y-0 z-50 sm:z-auto flex w-72 flex-col
        max-h-screen
        {isOpen ? 'flex shadow-lg': 'hidden sm:block'}
    ">
        <button on:click={() => {isOpen = false;}} class="
            absolute top-2 right-2
            sm:hidden
        ">
            <CloseIcon />
        </button>

        <div class="
            grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-2
            h-full
            sm:flex
        ">
            <div class="flex h-16 shrink-0 items-center flex-row gap-2 font-bold tracking-wider text-zinc-800">
                <span class="w-6 h-6 overflow-clip"><LogoIcon /></span>
                <a href="/my" class="flex flex-row">
                    <span class="text-zinc-400 font-light">my</span>
                    <span class="text-zinc-900 uppercase">Highlighter</span>
                </a>
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <nav class="
                flex flex-1 flex-col
            " on:click={() => { isOpen = false; }}
            >
                <ul class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul class="-mx-2 space-y-1">
                            <li>
                                <NavigationButton route="/my/highlights">
                                    <HighlightIcon />
                                    Highlights
                                </NavigationButton>

                                <NavigationButton route="/my/lists">
                                    <BookmarkIcon />
                                    Lists
                                </NavigationButton>

                                <NavigationButton route="/my/notes">
                                    <NoteIcon />
                                    Private Notes
                                </NavigationButton>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <div class="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                            {#each _bookmarkLists as bookmarkList}
                                {#if isTopLevel(bookmarkList)}
                                    <ListItem list={bookmarkList} allLists={_bookmarkLists} />
                                {/if}
                            {/each}
                        </ul>
                    </li>


                    {#if !$currentUser}
                        <li class="w-full">
                            <LoginButton klass="w-full" button={RoundedButton} />
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

    <div class="
        flex flex-row items-center justify-between
        sm:hidden
        {isOpen ? 'opacity-10' : '' }
    ">
        <div class="flex flex-row gap-2">
            <NavHamburger on:click={() => {isOpen = true}} />
            <div class="flex h-16 shrink-0 items-center flex-row gap-2 font-bold tracking-wider text-zinc-800">
                <span class="w-6 h-6"><LogoIcon /></span>
                <a href="/my" class="flex flex-row">
                    <span class="text-zinc-400 font-light">my</span>
                    <span class="text-zinc-900 uppercase">Highlighter</span>
                </a>
            </div>
        </div>
    </div>

    <main class="
        py-10 sm:pl-72 h-full pb-48
        {isOpen ? 'opacity-10' : '' }
    ">
        <div class="px-4 sm:px-6 lg:px-8 h-full">
            <div class="flex flex-col gap-6 max-h-screen">
                <!-- <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" id="default-search" class="
                        block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500
                        focus:bg-white
                    " placeholder="Search... (not yet)" required disabled>
                    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-orange-600 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-600 dark:hover:bg-orange-600 dark:focus:ring-orange-800">Search</button>
                </div> -->

                <!-- <div class="flex-grow pb-24"> -->
                    <slot />
                <!-- </div> -->

            </div>
        </div>
    </main>
</div>

<Modals>
    <div
        slot="backdrop"
        class="backdrop"
        on:click={closeModal}
        transition:fade>
    />
</Modals>

<style>
    :global(html) {
        background-color: #f7f7f7 !important;
    }

    :global(body) {
        background-color: #f7f7f7 !important;
    }

    .backdrop {
        position: fixed;
        /* z-index: 0; */
        top: 0;
        bottom: 0;
        right: 0;
        backdrop-filter: blur(0.15rem);
        left: 0;
        background: rgba(0,0,0,0.50)
    }
</style>