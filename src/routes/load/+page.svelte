<script lang="ts">
    import { page } from '$app/stores';
    import { fetchArticle } from '$lib/article';
    import Navbar from '$lib/components/Navbar/Navbar.svelte';
    import SidebarMode from '$lib/components/Sidebar/SidebarMode.svelte';
    import Reader from '$lib/components/articles/reader.svelte';
    import { NDKUser } from '@nostr-dev-kit/ndk';

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

<Navbar />

<div class="flex mb-4 px-2 md:px-6">
    <SidebarMode />

</div>

{#if text}
    {#if contentType === 'text/plain'}
        <Reader
            article={url}
            content={text.replace(/  /g, ' ')}
            unmarkedContent={text.replace(/  /g, ' ')}
            url={url}
        />
    {:else if contentType === 'embed/overcast'}
        overcast
    {:else}
        {#await fetchArticle(text, url, contentType)}
            <div class="card">
                <div class="card-body">
                    Loading {url}
                </div>
            </div>
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
            <div class="card">
                <div class="card-body">
                    {error.message}
                </div>
            </div>
        {/await}
    {/if}
{/if}