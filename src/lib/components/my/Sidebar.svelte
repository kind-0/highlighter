<script lang="ts">
    import LogoIcon from '$lib/icons/Logo.svelte';
    import HighlightIcon from '$lib/icons/Highlight.svelte';
    import BookmarkIcon from '$lib/icons/Bookmark.svelte';
    import NoteIcon from '$lib/icons/MyHighlights.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';

    import RelaysButton from '$lib/components/RelaysButton.svelte';

    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';
    import NavigationButton from './navigation/Button.svelte';

    import { currentUser } from '$lib/store';
    import { unsavedLongFormStore } from '$lib/stores/long-form';

    import ListItem from './navigation/list-item.svelte';
    import LoginButton from '$lib/ndk-svelte-components/LoginButton.svelte';
    import { NavHamburger, Skeleton } from 'flowbite-svelte';

    import type NDKList from '$lib/ndk-kinds/lists';

    import { sortedLists } from '$lib/stores/list';

    import { debounce } from 'throttle-debounce';

    let renderedList: NDKList[] | undefined = undefined;

    const updatedRenderedLists = debounce(300, () => {
        renderedList = $sortedLists;
    });

    $: if (renderedList?.length !== $sortedLists.length) {
        updatedRenderedLists();
    }

    function isTopLevel(thisList: NDKList) {
        for (const _list of $sortedLists) {
            const referenced = _list.tags.find((t) => t[1] === thisList.tagId());
            const notReferencedByItself = _list.tags.find((t) => t[1] !== _list.tagId()); // that is not itself
            if (referenced && notReferencedByItself) {
                return false;
            }
        }
        return true;
    }

    let isOpen = false;

</script>

<div class="flex flex-col  h-full">
    <div class="flex h-16 shrink-0 items-center justify-between flex-row gap-2 font-bold tracking-wider text-zinc-800">
        <div class="flex flex-row items-center gap-2">
            <span class="w-6 h-6 overflow-clip"><LogoIcon /></span>
            <a href="/my" class="flex flex-row">
                <span class="text-zinc-900 uppercase">Highlighter</span>
            </a>
        </div>

        <RelaysButton iconOnly={true} />
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <nav class="
        flex flex-1 flex-col
    " on:click={() => { isOpen = false; }}
    >
        <ul class="flex flex-1 flex-col gap-y-7 h-full ">
            <li>
                <ul class="-mx-2 space-y-1">
                    <li>
                        <NavigationButton route="/my/highlights">
                            <HighlightIcon class="w-6 h-6" />
                            Highlights
                        </NavigationButton>

                        <NavigationButton route="/my/lists">
                            <BookmarkIcon class="w-6 h-6" />
                            Lists
                        </NavigationButton>

                        <NavigationButton route="/my/notes">
                            <NoteIcon class="w-6 h-6" />
                            Private Notes
                        </NavigationButton>
                    </li>
                </ul>
            </li>

            {#if $unsavedLongFormStore.length > 0}
                <div class="flex flex-col gap-2">
                    <div class="text-xs font-semibold leading-6 text-gray-400">Unsaved Notes</div>
                    {#each $unsavedLongFormStore as item (item.encode())}
                        <NavigationButton route={`/my/notes/${item.encode()}/edit`}>
                            <div class="flex flex-1 flex-row items-center justify-between">
                                <div>{item.title??"Unsaved note"}</div>
                                <div class="text-xs text-white">{item.content.length}</div>
                            </div>
                        </NavigationButton>
                    {/each}
                </div>
            {/if}

            <li class="list-container">
                <div class="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
                {#if renderedList}

                    <ul class="-mx-2 mt-2  ">
                        <div class=" pb-8 ">
                        {#each renderedList ?? [] as item}
                            {#if isTopLevel(item)}
                                <ListItem {item} />
                            {/if}
                        {/each}
                    </div>
                </ul>
                {:else}
                    <Skeleton size="sm" class="my-8" />
                {/if}
            </li>

            {#if !$currentUser}
                <li class="w-full">
                    <LoginButton />
                </li>
            {:else}
                <li class="-mx-6 mt-auto">
                    <a href="#" class="flex items-center gap-x-4 px-8 py-3  text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 w-full">
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
</div>

<style>


.list-container {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 200px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>