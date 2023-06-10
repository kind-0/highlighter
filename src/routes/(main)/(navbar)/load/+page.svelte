<script lang="ts">
	import Highlight from '$lib/components/HighlightListItem.svelte';
    import { page } from '$app/stores';
    import { fetchArticle } from '$lib/article';
    import Reader from '$lib/components/articles/reader.svelte';
    import Article from '$lib/components/Article.svelte';
    import { NDKSubscription, NDKUser } from '@nostr-dev-kit/ndk';
  import { Card } from 'flowbite-svelte';

    let url = $page.url.searchParams.get('url') || '';
    let author = $page.url.searchParams.get('author') || '';

    if (url.startsWith('https://highlighter.com/load?url=')) {
        url = decodeURIComponent(url.replace('https://highlighter.com/load?url=', '') || '');
    }

    let mode = 'global';

    // function setMode() {
    //     switch (mode) {
    //         case 'my':
    //             myHighlights();
    //             break;
    //         case 'global':
    //             globalHighlights();
    //             break;
    //         case 'network':
    //             alert('coming soon™️!');
    //             break;
    //     }
    // }

    let articles;
    let article: any;
    let content: string;
    let authorHexpubkey: string;
    let highlights;
    let _highlights: App.Highlight[] = [];

    let notes;
    let _notes: App.Note[] = [];
    let activeSub: NDKSubscription | undefined;
    let fetchError: string | undefined;

    $: {
        // _highlights = ($highlights || []) as App.Highlight[];
        // _notes = ($notes || []) as App.Note[];

        if (author && authorHexpubkey === undefined) {
            try {
                if (author.startsWith('npub')) {
                    authorHexpubkey = (new NDKUser({npub: author})).hexpubkey();
                } else {
                    authorHexpubkey = author;
                }
            } catch(e) {}
        }

        // if (_highlights && content) {
        //     for (const highlight of _highlights) {
        //         content = content.replace(highlight.content, `<mark data-highlight-id="${highlight.id}">${highlight.content}</mark>`);
        //     }
        // }
    }
</script>

{#await fetchArticle(url)}
    <Card size="full">
        Loading {url}
    </Card>
{:then article}
    {#if article}
        <Reader
            {article}
            content={article.content||""}
            unmarkedContent={article.content||""}
            url={article.url}
        />
    {:else}
        <p>Article not found</p>
    {/if}
{/await}
