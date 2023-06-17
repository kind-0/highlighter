<script lang="ts">
    import { page } from '$app/stores';
    import { fetchArticle } from '$lib/article';
    import Reader from '$lib/components/articles/reader.svelte';
    import { NDKUser } from '@nostr-dev-kit/ndk';
    import { Card } from 'flowbite-svelte';

    export let data;
    const { text, contentType } = data;

    let url = $page.url.searchParams.get('url') || '';
    let author = $page.url.searchParams.get('author') || '';

    if (url.startsWith('https://highlighter.com/load?url=')) {
        url = decodeURIComponent(url.replace('https://highlighter.com/load?url=', '') || '');
    }

    let authorHexpubkey: string;

    $: {
        if (author && authorHexpubkey === undefined) {
            try {
                if (author.startsWith('npub')) {
                    authorHexpubkey = (new NDKUser({npub: author})).hexpubkey();
                } else {
                    authorHexpubkey = author;
                }
            } catch(e) {}
        }
    }
</script>

{#if text}
    {#if contentType === 'text/plain'}
        <Reader
            article={url}
            content={text.replace(/  /g, ' ')}
            unmarkedContent={text.replace(/  /g, ' ')}
            url={url}
        />
    {:else}
        {#await fetchArticle(text, url, contentType)}
            <Card size="full">
                Loading {url}
            </Card>
        {:then article}
            {#if article}
                <Reader
                    renderAsHtml={true}
                    {article}
                    content={article.content||""}
                    unmarkedContent={article.content||""}
                    url={article.url}
                />
            {:else}
                <p>Article not found</p>
            {/if}
        {:catch error}
            <Card size="full">
                {error.message}
            </Card>
        {/await}
    {/if}
{/if}