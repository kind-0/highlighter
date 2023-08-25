<script lang="ts">
    import AddTopicInput from "$components/AddTopicInput.svelte";
    import CardWithTitle from "$components/cards/CardWithTitle.svelte";
    import Hashtag from "$icons/Hashtag.svelte";
    import { user, userFollowHashtags, userFollows } from "$stores/session";
    import { fade } from "svelte/transition";
    import ndk from '$stores/ndk';
    import { NDKList, type NDKEvent, type NDKFilter, type NostrEvent } from "@nostr-dev-kit/ndk";
    import GeneralButton from "$components/buttons/GeneralButton.svelte";
    import EmptyState from "$icons/EmptyState.svelte";

    let shouldDisplay: boolean = false;
    let newTopics: string[] = [];

    async function getSuggestedTopics(selectedTopics?: string[]): Promise<string[]> {
        const topics: Record<string, number> = {};
        const filters: NDKFilter[] = [];
        let filter: NDKFilter = { "#d": ["hashtags"] };

        if (selectedTopics && selectedTopics.length >= 3) {
            for (const topic of selectedTopics) {
                filter = { "#t": [topic] };

                if ($userFollows.size > 100) {
                    filter["authors"] = Array.from($userFollows);
                }

                filters.push({ "#t": [topic] });
            }
        } else if ($userFollows.size > 1000) {
            filter["authors"] = Array.from($userFollows);
        }

        if (filters.length === 0) filters.push(filter);

        const hashtagsLists = await $ndk.fetchEvents(filters);

        // iterate through all the hashtags lists
        hashtagsLists.forEach((hashtagsList: NDKEvent) => {
            hashtagsList.getMatchingTags('t').forEach((tag) => {
                if (topics[tag[1]]) {
                    topics[tag[1]] += 1;
                } else {
                    topics[tag[1]] = 1;
                }
            });
        });

        const sortedTopics = Object.keys(topics).sort((a, b) => topics[b] - topics[a]);
        return sortedTopics;
    }

    function filterSuggestedTopics(topics: string[], searchInput?: string): string[] {
        if (searchInput) {
            return topics
                .filter((topic) => topic.includes(searchInput))
                .slice(0, 10);
        } else {
            return topics
                .filter((topic) => !userTopics.includes(topic))
                .slice(0, 50);
        }
    }

    $: shouldDisplay = ($userFollowHashtags.length < 3) && !!$user;

    function addTopic(topic: string) {
        if (userTopics.includes(topic)) return;

        searchInput = "";

        newTopics.push(topic);
        newTopics = newTopics;
        userTopics = [...$userFollowHashtags, ...newTopics];

        if (newTopics.length > 2) {
            suggestedTopicsPromise = new Promise<void>((resolve) => {
                getSuggestedTopics(userTopics).then((t: string[]) => {
                    suggestedTopics = t;
                    resolve();
                });
            });
        }
    }

    function removeTopic(topic: string) {
        $userFollowHashtags = $userFollowHashtags.filter((t) => t !== topic);
        newTopics = newTopics.filter((t) => t !== topic);
        $userFollowHashtags = $userFollowHashtags;
        newTopics = newTopics;
        userTopics = [...$userFollowHashtags, ...newTopics];
    }

    let userTopics: string[];

    $: userTopics = [...$userFollowHashtags, ...newTopics];

    let searchInput: string;

    let suggestedTopics: string[] = [];
    let suggestedTopicsPromise = new Promise<void>((resolve) => {
        getSuggestedTopics(userTopics).then((t: string[]) => {
            suggestedTopics = t;
            resolve();
        });
    });

    $: filteredSuggestedTopics = filterSuggestedTopics(suggestedTopics, searchInput);

    async function done() {
        const hashtagList = new NDKList($ndk, {
            kind: 30001,
            tags: [
                ["d", "hashtags"],
                ...userTopics.map((topic) => ["t", topic]),
            ],
        } as NostrEvent);

        hashtagList.publish().catch((e) => {
            alert(e.message);
            shouldDisplay = true;
        })
        shouldDisplay = false;
    }
</script>

{#if shouldDisplay}
    <div transition:fade>
        <CardWithTitle
            title="Select Topics to personalize your experience."
        >
            <div class="flex flex-row divide-x divide-base-300 w-full">
                <div class="w-1/2">
                    <div class="p-4">
                        <AddTopicInput
                            bind:value={searchInput}
                            on:add={(e) => addTopic(e.detail)}
                        />
                    </div>
                    {#if userTopics.length === 0}
                        <div class="flex items-center justify-center h-full self-center p-4">
                            <EmptyState />
                        </div>
                    {:else}
                        <ul class="menu w-full rounded-box">
                            <li class="menu-title">TOPICS</li>

                            {#each userTopics as suggestedHashtag}
                                <li transition:fade={{ duration: 100 }}>
                                    <button on:click={() => removeTopic(suggestedHashtag)}>
                                        <Hashtag class="w-6 h-6 mr-1 text-accent2" />
                                        <span class="text-base-100-content font-light">
                                            {suggestedHashtag}
                                        </span>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                <div class="w-1/2">
                    {#if filteredSuggestedTopics.length > 0}
                        <ul class="menu w-full rounded-box overflow-y-auto max-h-64 flex-nowrap overflow-x-hidden">
                            <li class="menu-title">SUGGESTED</li>

                            {#each filteredSuggestedTopics as topic}
                                {#if !$userFollowHashtags.includes(topic)}
                                    <li transition:fade={{ duration: 100 }}>
                                        <button on:click={() => addTopic(topic)}>
                                            <Hashtag class="w-6 h-6 mr-1 text-base-300-content" />
                                            <span class="text-base-100-content !font-thin">
                                                {topic}
                                            </span>
                                        </button>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    {/if}

                    {#await suggestedTopicsPromise}
                        {#if filteredSuggestedTopics.length === 0}
                            <div class="
                                flex-grow items-center justify-center w-full h-full flex flex-col gap-4
                            ">
                                Fetching suggestions
                                <span class="loading loading-lg m-4 opacity-50"></span>
                            </div>
                        {:else}
                            <div class="
                                flex-row flex-grow text-xs items-center px-6 flex gap-4
                            ">
                                Fetching suggestions
                                <span class="loading loading-sm m-4 opacity-50"></span>
                            </div>
                        {/if}
                    {/await}
                </div>
            </div>

            <div class="
                flex flex-row w-full
                border-t border-base-300 items-center
            ">
                <div class="w-1/2 p-4">
                </div>
                <div class="w-1/2 p-4 flex justify-end">
                    <GeneralButton
                        class="px-10 !font-thin self-end"
                        on:click={done}
                    >
                        Done
                    </GeneralButton>
                </div>
            </div>
        </CardWithTitle>
    </div>
{/if}

<style>
    li.menu-title {
        border-bottom: 0 !important;
    }
</style>

