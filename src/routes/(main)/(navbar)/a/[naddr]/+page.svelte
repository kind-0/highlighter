<script lang="ts">
	import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import Reader from '$lib/components/articles/reader.svelte';

    import { page } from '$app/stores';
    import ArticleInterface, { articleFromEvent } from '$lib/interfaces/article';
    import MarkdownIt from 'markdown-it';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { filterFromNaddr, idFromNaddr } from '$lib/utils';
    import { nip19 } from 'nostr-tools';

    const { naddr } = $page.params;
    const decoded = nip19.decode(naddr);
    const { type } = decoded;
    let articleId: string;
    let articleEvent: NDKEvent;

    let loadedId: string;

    switch (type) {
        case 'note': articleId = decoded.data as string; break;
        case 'nevent': articleId = decoded.data.id; break;
        case 'naddr': articleId = idFromNaddr(naddr); break;
    }

    let article: App.Article;
    let content: string = '';
    let unmarkedContent: string = '';

    // Load article
    $: if (type === 'note' || type === 'nevent' && !article) {
        loadedId = articleId;
        console.log('fetching', articleId);
        setTimeout(async () => {
            const e = await $ndk.fetchEvent({ids: [articleId]});

            if (!e) return;

            try {
                if (e.kind === 1) {
                    article = {
                        id: e.id,
                        title: "",
                        tags: e.tags,
                        publisher: e.pubkey,
                        author: e.pubkey,
                        content: e.content,
                        event: JSON.stringify(e.rawEvent()),
                    } as App.Article;
                    console.log('article', article);
                    articleEvent = e;
                    content = e.content;
                } else {
                    articleEvent = e;
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    $: if (type === 'naddr' && !loadedId) {
        loadedId = articleId;
        $ndk.fetchEvent(filterFromNaddr(naddr)).then(e => {
            if (!e) {
                console.log('unable to find', naddr, filterFromNaddr(naddr))
                return;
            }

            articleEvent = e;
            article = articleFromEvent(e);
            const md = new MarkdownIt();
            md.linkify?.set();
            unmarkedContent = md.render(article.content);
            content = unmarkedContent;
        });
    }
</script>

{#if article}
    <Reader
        {article}
        {content}
        {unmarkedContent}
        {articleEvent}
    />
{:else if articleEvent}
    <Reader
        {content}
        {unmarkedContent}
        {articleEvent}
    >
        <GenericEventCard event={articleEvent} />
    </Reader>
{/if}