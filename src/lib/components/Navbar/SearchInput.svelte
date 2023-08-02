<script lang="ts">
    import { Article, Hash, MagnifyingGlass, MediumLogo } from 'phosphor-svelte';
    import { getSearchProcessingInstructions } from '$lib/utils/search/index.js';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { searchQuery, processingInstructions } from '$lib/stores/search';
    import Stars from '$lib/icons/Stars.svelte';
    import NostrIcon from '$lib/icons/NostrIcon.svelte';

    let loading = false;
    let hasFocus = false;

    function process() {
        loading = true;
        getSearchProcessingInstructions($searchQuery).then((p) => {
            $processingInstructions = p;
            debugger;
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
        const currentPage = $page.url.pathname;

        if (currentPage !== '/web') {
            goto('/web');
        }
    }

    function useSuggestion(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('data-href');

        if (href) {
            $searchQuery = href;

            // send an enter to trigger the search
            process();
        }
    }
</script>

<!-- TODO responsive search input, maybe expand wide when hasFocus -->
<div class="dropdown w-full" class:dropdown-open={hasFocus}>
    <div class="relative rounded-md shadow-sm flex-grow h-full">
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
            on:blur={() => (hasFocus = false)}
        />
        {#if loading}
            <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center pl-3">
                <span class="loading loading-spinner text-accent2" />
            </div>
        {/if}
    </div>

    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul tabindex="0" class="absolute dropdown-content z-50 menu p-4 my-1 bg-base-300 rounded-box shadow-2xl shadow-black w-full overflow-auto">
        <div class="px-4 py-4 bg-base-100 rounded-lg flex flex-row items-center gap-4 mb-2 text-accent2">
            <span class="star-icon bg-base-100 rounded-lg">
                <Stars class="w-14 h-14 p-2" />
            </span>
            Highlight from any kind of sources, web articles, podcasts, videos, nostr notes. Anything!
        </div>
        <li class="menu-title">Examples</li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <li>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <a
                class="flex flex-row items-center justify-between whitespace-nowrap w-full"
                data-href="https://overcast.fm/+npr8xdWfc"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src="https://public.overcast-cdn.com/art/2598591?v15" class="w-12 h-fit mr-1 inline-block rounded-sm" />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Podcast (Overcast) </span>

                        <div class="text-xs truncate opacity-100 w-full">CD100: The Disturbing Chainalysis Led Prosecution</div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="text-base-300-content flex flex-col items-end"> https://overcast.fm/+npr8xdWfc </span>
                    <img src="https://overcast.fm/apple-touch-icon.png" class="w-6 h-6 mr-1 inline-block rounded-lg" />
                </div>
            </a>
        </li>
        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-row items-center justify-between whitespace-nowrap w-full"
                data-href="naddr1qqxnzd3exqcnzvehxqungdfhqgsph3c2q9yt8uckmgelu0yf7glruudvfluesqn7cuftjpwdynm2gygrqsqqqa28mesjl6"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img
                        src="https://nostr.build/i/p/nostr.build_4fb6accf6b24cdb58be127d9a509c3acd3e859bbe24b5c194b82bf30bc1e511a.jpg"
                        class="w-12 h-fit mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Nostr Long-form Article </span>

                        <div class="text-xs truncate opacity-50 w-full">Imagined vs actual startup journey</div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="text-base-300-content flex flex-col items-end"> naddr1qqxnzd3exqcnzvehxqung... </span>
                    <Article class="w-6 h-6 mr-1 inline-block rounded-lg text-accent2" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a class="flex flex-row items-center justify-between whitespace-nowrap w-full" data-href="#bitcoin" on:click={useSuggestion}>
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <Hash class="w-12 h-fit mr-1 inline-block rounded-sm text-base-100-content" />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Nostr Hashtag </span>

                        <div class="text-xs truncate opacity-50 w-full">Bitcoin highlights</div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="text-base-300-content flex flex-col items-end"> #bitcoin </span>
                    <NostrIcon class="w-6 h-6 mr-1 inline-block rounded-lg text-accent2" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-row items-center justify-between whitespace-nowrap w-full"
                data-href="https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img
                        src="https://miro.medium.com/v2/resize:fill:176:176/1*ps6SOtxwztUT8gdVXllskg@2x.jpeg"
                        class="w-12 h-fit mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Website </span>

                        <div class="text-xs truncate opacity-50 w-full">Imagined vs actual startup journey</div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="text-xs text-base-300-content flex flex-col items-end">
                        <div class="text-base-300-content text-sm">https://medium.com/btc24/nost...</div>
                    </span>
                    <MediumLogo class="w-6 h-6 mr-1 inline-block rounded-lg text-accent2" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-row items-center justify-between whitespace-nowrap w-full"
                data-href="note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img
                        src="https://nostr.build/i/p/nostr.build_6b9909bccf0f4fdaf7aacd9bc01e4ce70dab86f7d90395f2ce925e6ea06ed7cd.jpeg"
                        class="w-12 h-fit mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Nostr Short-note </span>

                        <div class="text-xs truncate opacity-50 w-full">nostr has its issues. but for those who figure it out</div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="text-base-300-content flex flex-col items-end"> note194n247lecqgcskk5rmmfgr... </span>
                    <NostrIcon class="w-6 h-6 mr-1 inline-block rounded-lg text-accent2" />
                </div>
            </a>
        </li>
    </ul>
</div>
