<script lang="ts">
    import { Hash, MagnifyingGlass } from 'phosphor-svelte';
    import { getSearchProcessingInstructions } from '$lib/utils/search/index.js';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { searchQuery, processingInstructions } from '$lib/stores/search';
    import NostrIcon from '$lib/icons/NostrIcon.svelte';
    import MicIcon from '$lib/icons/MicIcon.svelte';
    import LongForm from '$lib/icons/LongForm.svelte';
    import Hashtag from '$lib/icons/Hashtag.svelte';
    import WebIcon from '$lib/icons/WebIcon.svelte';
    import Web3DIcon from '$lib/icons/Web3DIcon.svelte';
    import Hashtag3DIcon from '$lib/icons/Hashtag3DIcon.svelte';
    import Longform3DIcon from '$lib/icons/Longform3DIcon.svelte';
    import Mic3DIcon from '$lib/icons/Mic3DIcon.svelte';

    let loading = false;
    export let hasFocus = false;

    export function process() {
        loading = true;
        hasFocus = false;
        getSearchProcessingInstructions($searchQuery).then((p) => {
            $processingInstructions = p;
            loading = false;

            if ($processingInstructions?.dvm) {
                gotoWeb();
            }
        });
    }

    function keyUp(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();

            process();
        } else if (event.key === 'Escape') {
            $processingInstructions = {};
            loading = false;
            $searchQuery = '';
        }
    }

    function gotoWeb() {
        goto('/web');
    }

    function useSuggestion(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');

        if (href) {
            $searchQuery = href;

            hasFocus = false;

            // move focus to search input
            const input = document.querySelector('input[type=search]') as HTMLInputElement;
            input.focus();


            // send an enter to trigger the search
            process();
        }
    }
</script>

{#if hasFocus}
<div
        class="backdrop z-10 fixed"
        on:click={() => { hasFocus = false }}
        transition:fade={{ duration: 100 }}></div>
{/if}

<div class="dropdown w-full" class:dropdown-open={hasFocus}>
    <div class="relative rounded-full shadow-sm flex-grow h-full z-50">
        <div class="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-3">
            <MagnifyingGlass class="w-6 h-6 z-10 brightness-125" />
        </div>
        <input
            tabindex="0"
            type="search"
            autocomplete="off"
            class="
                input
                block w-full rounded-full py-1.5 pl-14
                focus:border-0
                focus:ring-2 focus:ring-inset focus:ring-accent2
                !bg-base-200
                text-base-100-content
                text-base-300-placeholder placeholder:opacity-75
            "
            placeholder="Search..."
            bind:value={$searchQuery}
            on:keyup={keyUp}
            on:focus={() => (hasFocus = true)}
        />
        {#if loading}
            <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center pl-3">
                <span class="loading loading-spinner text-accent2" />
            </div>
        {/if}
    </div>

    <ul tabindex="0" class="absolute dropdown-content z-50 menu p-0 my-2 bg-base-300 rounded-box w-full">
        <div class="relative flex w-full justify-center py-4 mb-0 md:mb-4">
            <div class="flex flex-row justify-between w-full h-full absolute left-0 px-1 md:px-4">
                <div class="flex">
                    <div class="pl-0 md:pl-6 pt-6">
                        <Web3DIcon class="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <div class="pl-0 md:pl-6 pt-2 md:pt-5">
                        <Hashtag3DIcon class="w-5 h-5 md:w-8 md:h-8"/>
                    </div>
                </div>
                <div class="flex">
                    <div class="pr-0 md:pr-6 pt-2 md:pt-4">
                        <Longform3DIcon class="w-5 h-5 md:w-8 md:h-8"/>
                    </div>
                    <div class="pr-0 md:pr-8 pt-6">
                        <Mic3DIcon class="w-8 h-8 md:w-12 md:h-12"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center gap-1 md:gap-4 text-center ">
                <div class="pt-1.5 text-3xl md:text-4xl font-bold text-base-100-content md:whitespace-nowrap">
                    Highlight anything
                </div>
                <div class="text-xs text-accent2 whitespace-nowrap">
                    Web articles, Podcasts, Videos, Nostr notes...
                </div>
            </div>
        </div>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center gap-0 px-5 justify-between w-full "
                href="https://overcast.fm/+npr8xdWfc"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-5 w-full md:w-1/2 ">
                    <img src="https://public.overcast-cdn.com/art/2598591?v15" class="w-12 h-12 object-cover inline-block rounded-sm" />

                    <div class="w-0 mr-0 md:mr-10 flex flex-col flex-grow gap-0.5 items-start justify-between ">
                        <p class="text-base-100-content truncate text-base w-full leading-normal font-medium"> Podcast (Overcast)</p>

                        <p class="font-medium leading-[18px] text-xs truncate opacity-100 w-full">CD100: The Disturbing Chainalysis Led Prosecution</p>
                    </div>
                </div>

                <div class="hidden md:flex flex-row flex-grow gap-5 items-center justify-start">
                    <div class="w-0 ml-10 flex flex-grow justify-end">
                        <p class="text-base-300-content text-xs truncate">https://overcast.fm/+npr8xdWfc</p>
                    </div>
                    <MicIcon class="w-12 h-12 bg-base-300 text-zinc-400 rounded-lg" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center gap-0 px-5 justify-between w-full"
                href="naddr1qqxnzd3exqcnzvehxqungdfhqgsph3c2q9yt8uckmgelu0yf7glruudvfluesqn7cuftjpwdynm2gygrqsqqqa28mesjl6"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-5 w-full md:w-1/2">
                    <img src="https://nostr.build/i/p/nostr.build_4fb6accf6b24cdb58be127d9a509c3acd3e859bbe24b5c194b82bf30bc1e511a.jpg" class="w-12 h-12 object-cover inline-block rounded-sm" />

                    <div class="w-0 mr-0 md:mr-10 flex flex-col flex-grow gap-0.5 items-start justify-between">
                        <p class="text-base-100-content truncate text-base w-full leading-normal font-medium">Nostr Long-form Article</p>

                        <p class="font-medium leading-[18px] text-xs truncate opacity-100 w-full">Imagined vs actual startup journey</p>
                    </div>
                </div>
                <div class="hidden md:flex flex-row flex-grow gap-5 items-center justify-start">
                    <div class="w-0 ml-10 flex flex-grow justify-end">
                        <p class="text-base-300-content text-xs truncate"> naddr1qqxnzd3exqcnzvehxqungdfhqgsph3c2q9yt8uckmgelu0yf7glruudvfluesqn7cuftjpwdynm2gygrqsqqqa28mesjl6</p>
                    </div>
                    <LongForm class="w-12 h-12 bg-base-300 text-zinc-400 rounded-lg" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center gap-0 px-5 justify-between w-full"
                href="#bitcoin"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-5 w-full md:w-1/2">

                    <Hash class="w-12 h-12 object-cover inline-block rounded-sm text-base-100-content" />

                    <div class="w-0 mr-0 md:mr-10 flex flex-col flex-grow gap-0.5 items-start justify-between">
                        <p class="text-base-100-content truncate text-base w-full leading-normal font-medium">Nostr Hashtag</p>

                        <p class="font-medium leading-[18px] text-xs truncate opacity-100 w-full">Bitcoin highlights</p>
                    </div>
                </div>

                <div class="hidden md:flex flex-row flex-grow gap-5 items-center justify-start">
                    <div class="w-0 ml-10 flex flex-grow justify-end">
                        <p class="text-base-300-content text-xs truncate">#bitcoin</p>
                    </div>
                    <Hashtag class="w-12 h-12 bg-base-300 text-zinc-400 rounded-lg" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center gap-0 px-5 justify-between w-full"
                href="https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-5 w-full md:w-1/2">
                    <img src="https://miro.medium.com/v2/resize:fill:176:176/1*ps6SOtxwztUT8gdVXllskg@2x.jpeg"class="w-12 h-12 object-cover inline-block rounded-sm" />

                    <div class="w-0 mr-0 md:mr-10 flex flex-col flex-grow gap-0.5 items-start justify-between">
                        <p class="text-base-100-content truncate text-base w-full leading-normal font-medium"> Website </p>

                        <p class="font-medium leading-[18px] text-xs truncate opacity-100 w-full">Imagined vs actual startup journey</p>
                    </div>
                </div>

                <div class="hidden md:flex flex-row flex-grow gap-5 items-center justify-start">
                    <div class="w-0 ml-10 flex flex-grow justify-end">
                        <p class="text-base-300-content text-xs truncate"> https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9</p>
                    </div>
                    <WebIcon class="w-12 h-12 bg-base-300 text-zinc-400 rounded-lg" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center gap-0 px-5 mb-2 justify-between w-full"
                href="note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-5 w-full md:w-1/2">
                    <img src="https://nostr.build/i/p/nostr.build_6b9909bccf0f4fdaf7aacd9bc01e4ce70dab86f7d90395f2ce925e6ea06ed7cd.jpeg" class="w-12 h-12 object-cover inline-block rounded-sm" />

                    <div class="w-0 mr-0 md:mr-10 flex flex-col flex-grow gap-0.5 items-start justify-between">
                        <p class="text-base-100-content truncate text-base w-full leading-normal font-medium"> Nostr Short-note </p>

                        <p class="font-medium leading-[18px] text-xs truncate opacity-100 w-full">nostr has its issues. but for those who figure it out</p>
                    </div>
                </div>

                <div class="hidden md:flex flex-row flex-grow gap-5 items-center justify-start">
                    <div class="w-0 ml-10 flex flex-grow justify-end">
                        <p class="text-base-300-content text-xs truncate"> note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa</p>
                    </div>
                    <NostrIcon class="w-12 h-12 inline-block rounded-lg bg-base-300 p-2 text-zinc-400" />
                </div>
            </a>
        </li>
    </ul>
</div>


<style>
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        backdrop-filter: blur(0.15rem);
        left: 0;
        background: rgba(0,0,0,0.50)
    }
</style>