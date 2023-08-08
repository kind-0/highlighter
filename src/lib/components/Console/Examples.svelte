<script lang="ts">
    import Hashtag from "$lib/icons/Hashtag.svelte";
    import LongForm from "$lib/icons/LongForm.svelte";
    import MicIcon from "$lib/icons/MicIcon.svelte";
    import NostrIcon from "$lib/icons/NostrIcon.svelte";
    import WebIcon from "$lib/icons/WebIcon.svelte";
    import { searchQuery } from "$lib/stores/search";
    import { Hash } from "phosphor-svelte";

    export let url: string;

    function useSuggestion(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('data-href');

        if (href) {
            $searchQuery = href;

            // send an enter to trigger the search
            // process();
        }
    }
</script>

<div class="flex flex-col md:flex-row w-fit items-center gap-4 mx-auto mb-10">
    <div class="flex md:hidden flex-row gap-2">
        <img src="/images/search/search-right.svg" />
        <img src="/images/search/search-left.svg" />
    </div>

    <div class="w-1/5 md:flex flex-col items-end hidden">
        <img src="/images/search/search-left.svg" />
    </div>
    <div class="w-full md:w-3/5 flex flex-col items-center gap-4 text-center">
        <div class="text-4xl font-bold text-base-100-content md:whitespace-nowrap">
            Highlight anything
        </div>

        <div class="text-accent2">
            Web articles, Podcasts, Videos, Nostr notes...
        </div>
    </div>
    <div class="w-1/5 md:flex flex-col items-center hidden">
        <img src="/images/search/search-right.svg" />
    </div>
</div>

<div class="w-full flex flex-col gap-8">
    <ul tabindex="0" class="menu p-4 my-1 bg-base-300 rounded-box card w-full overflow-auto">

        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center justify-between whitespace-nowrap w-full"
                data-href="https://overcast.fm/+npr8xdWfc"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src="https://public.overcast-cdn.com/art/2598591?v15" class="w-12 h-12 object-cover mr-1 inline-block rounded-sm" />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg">Podcast (Overcast) </span>

                        <div class="text-xs truncate opacity-100 w-full">CD100: The Disturbing Chainalysis Led Prosecution</div>
                    </div>
                </div>

                <div class="md:flex flex-row gap-2 items-center hidden">
                    <span class="text-base-300-content text-xs md:text-base flex flex-col items-end"> https://overcast.fm/+npr8xdWfc </span>
                    <MicIcon class="w-12 h-12 bg-base-300 p-2 rounded-lg" />
                </div>
            </a>
        </li>
        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center justify-between whitespace-nowrap w-full"
                data-href="naddr1qqxnzd3exqcnzvehxqungdfhqgsph3c2q9yt8uckmgelu0yf7glruudvfluesqn7cuftjpwdynm2gygrqsqqqa28mesjl6"
                on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <img
                        src="https://nostr.build/i/p/nostr.build_4fb6accf6b24cdb58be127d9a509c3acd3e859bbe24b5c194b82bf30bc1e511a.jpg"
                        class="w-12 h-12 object-cover mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Nostr Long-form Article </span>

                        <div class="text-xs truncate opacity-50 w-full">Imagined vs actual startup journey</div>
                    </div>
                </div>

                <div class="md:flex flex-row gap-2 items-center hidden">
                    <span class="text-base-300-content flex flex-col items-end"> naddr1qqxnzd3exqcnzvehxqung... </span>
                    <LongForm class="w-12 h-12 bg-base-300 p-2 rounded-lg" />
                </div>
            </a>
        </li>

        <div class="divider my-0" />
        <li>
            <a
                class="flex flex-col md:flex-row items-start md:items-center justify-between whitespace-nowrap w-full"
                data-href="#bitcoin" on:click={useSuggestion}
            >
                <div class="flex flex-row gap-2 items-center w-2/3 overflow-clip">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <Hash class="w-12 h-12 object-cover mr-1 inline-block rounded-sm text-base-100-content" />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Nostr Hashtag </span>

                        <div class="text-xs truncate opacity-50 w-full">Bitcoin highlights</div>
                    </div>
                </div>

                <div class="md:flex flex-row gap-2 items-center hidden">
                    <span class="text-base-300-content flex flex-col items-end"> #bitcoin </span>
                    <Hashtag class="w-12 h-12 bg-base-300 p-2 rounded-lg" />
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
                        class="w-12 h-12 object-cover mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg"> Website </span>

                        <div class="text-xs truncate opacity-50 w-full">Imagined vs actual startup journey</div>
                    </div>
                </div>

                <div class="md:flex flex-row gap-2 items-center hidden">
                    <span class="text-xs text-base-300-content flex flex-col items-end">
                        <div class="text-base-300-content text-sm">https://medium.com/btc24/nost...</div>
                    </span>
                    <WebIcon class="w-12 h-12 bg-base-300 p-2 rounded-lg" />
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
                        class="w-12 h-12 object-cover mr-1 inline-block rounded-sm"
                    />

                    <div class="flex flex-col gap-0.5 items-start truncate">
                        <span class="text-base-100-content truncate text-lg">Nostr Short-note</span>

                        <div class="text-xs truncate opacity-50 w-full">nostr has its issues. but for those who figure it out</div>
                    </div>
                </div>

                <div class="md:flex flex-row gap-2 items-center hidden">
                    <span class="text-base-300-content flex flex-col items-end">note194n247lecqgcskk5rmmfgr...</span>
                    <NostrIcon class="w-12 h-12 mr-1 inline-block rounded-lg bg-base-300 p-2" />
                </div>
            </a>
        </li>
    </ul>
</div>