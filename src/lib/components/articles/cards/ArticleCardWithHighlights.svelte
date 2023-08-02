<script lang="ts">
	import MarkdownIt from 'markdown-it';
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import ndk from "$lib/stores/ndk";
    import CardContent from '$lib/components/events/content.svelte';
    import HighlightList from '$lib/components/HighlightList.svelte';
    import { Card } from "flowbite-svelte";
    import AvatarWithName from "$lib/components/AvatarWithName.svelte";
    import Avatar from "$lib/components/Avatar.svelte";
    import { NDKKind } from "$lib/ndk-kinds";
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import HighlightListItem from '$lib/components/HighlightListItem.svelte';
    import Favicon from '$lib/components/Favicon.svelte';

    export let highlights: NDKHighlight[];

    let articlePromise = highlights[0].getArticle();

    function articleTitle(article: NDKEvent | string) {
        return article?.title || article?.url || article.toString();
    }

    function articleLink(article: NDKEvent | string) {
        if (article instanceof NDKEvent) {
            return `/a/${article.encode()}`;
        } else {
            return `/load?url=${encodeURIComponent(article)}`;
        }
    }

    function articleContent(article: NDKEvent) {
        if (article.kind === NDKKind.LongForm) {
            const md = new MarkdownIt();
            md.linkify?.set();
            return md.render(article.content);
        } else {
            return article.content;
        }
    }

    // const quotes = $ndk.storeSubscribe({
    //     "#q": highlights.
    // })

    function highlightAuthors(highlights: NDKHighlight[]) {
        const authors = new Set<string>();
        for (const highlight of highlights) {
            authors.add(highlight.author.hexpubkey());
        }
        return Array.from(authors);
    }
</script>

{#await articlePromise then article}
    {#if article}
        <Card size="xl" class="
            flex flex-col gap-8
            sm:hover:bg-white
        " href={articleLink(article)}>
            <div class="flex flex-col">
                {#if articleTitle(article) && article instanceof NDKEvent}
                    <a href={`/a/${article.encode()}`} class="
                        text-3xl font-bold font-sans leading-normal text-left
                    ">
                        {articleTitle(article)}
                    </a>
                {:else if typeof article === "string"}
                    <div class="flex flex-row gap-2 items-center">
                        <Favicon url={article} class="w-8 h-8 rounded-md" />
                        <a href={`/load?url=${encodeURIComponent(article)}`} class="
                            text-3xl font-bold font-sans leading-normal text-left
                        ">
                            {new URL(article).hostname}
                        </a>
                    </div>
                {/if}

                {#if article?.author}
                    <AvatarWithName pubkey={article?.author.hexpubkey()} />
                {:else if typeof article === "string"}
                    <p>{article}</p>
                {/if}
            </div>

            {#if article?.summary && article?.image}
                <div class="sm:flex">
                    <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                        <img src={article?.image} alt="" class="h-32 border border-gray-300 bg-white text-gray-300" />
                    </div>
                    <div>
                        <p class="mt-1">
                            {article?.summary}
                        </p>
                    </div>
                </div>
            {:else if article?.summary}
                <div class="text-xl">{article?.summary}</div>
            {:else if article?.image}
                <div class="flex flex-row">
                    <img src={article?.image} alt="" class="h-32 rounded-md " />
                </div>
            {:else}
                <HighlightListItem
                    highlight={highlights[0]}
                    skipTitle={true}

                />
            {/if}

            <div class="border-y -mx-4 -mb-4 px-4 py-2 flex flex-row justify-between items-center">
                <div>
                    <span class="font-semibold">{highlights.length}</span>
                    highlights
                    <span class="">by</span>
                    <span class="font-semibold">{highlightAuthors(highlights).length}</span>
                    authors
                </div>
                <div class="flex -space-x-2 overflow-hidden mt-2">
                    {#each highlightAuthors(highlights) as pubkey (pubkey)}
                        <Avatar pubkey={pubkey} class="inline-block h-7 w-7 rounded-full ring-2 ring-white" />
                    {/each}
                </div>
            </div>
        </Card>
    {/if}
{:catch e}
    error {e}
{/await}

<!-- <style>
    * {
        font-family: 'Montserrat', sans-serif;
    }
</style> -->