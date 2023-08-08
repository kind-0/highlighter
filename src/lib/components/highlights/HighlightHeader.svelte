<script lang="ts">
    import type NDKHighlight from "$lib/ndk-kinds/highlight";
    import AvatarWithName from "../AvatarWithName.svelte";
    import Favicon from "../Favicon.svelte";
    import linkToArticle from './link-to-article';
    import Avatar from "../Avatar.svelte";
    import { NDKEvent, type NDKUser, NDKArticle } from "@nostr-dev-kit/ndk";

    export let highlight: NDKHighlight;

    let author: NDKUser;

    const getArticle = new Promise((resolve, reject) => {
        highlight.getArticle().then(a => {
            if (a instanceof NDKEvent)
                author = a.author;
            resolve(a);
        }).catch(e => {
            reject(e);
        });
    });
</script>

{#await getArticle then article}
    <div class="text-lg font-regular truncate text-base-100-content">
        {#if article instanceof NDKArticle && article.title}
            <div class="flex flex-row items-center gap-2">
                <Avatar user={author} size="small" type="square" />
                <a href={linkToArticle(highlight)}>{article.title}</a>
            </div>
        {:else if highlight?.url && highlight.url.match(/^http(s)?:\/\//)}
            <div class="flex flex-row items-center gap-2">
                <Favicon url={highlight.url} class="w-8 h-8 rounded-md" />
                <a href={linkToArticle(highlight)}>{new URL(highlight.url).hostname}</a>
            </div>
        {:else if author}
            <a href={linkToArticle(highlight)}>Note <AvatarWithName pubkey={author.hexpubkey()} avatarClass="w-10 h-10" /></a>
        {:else if typeof article === 'string'}
            <a class="" href={linkToArticle(highlight)}>{article}</a>
        {:else if !article}
            Unknown article
        {/if}
    </div>
{/await}