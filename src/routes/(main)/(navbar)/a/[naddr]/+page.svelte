<script lang="ts">
    import Reader from '$lib/components/articles/reader.svelte';

    import { page } from '$app/stores';
    import { NDKKind } from "$lib/ndk-kinds";
    import MarkdownIt from 'markdown-it';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card, Skeleton, TestimonialPlaceholder } from 'flowbite-svelte';
    import ZapEventCard from '$lib/components/zaps/ZapEventCard.svelte';

    const { naddr } = $page.params;
    let article: NDKEvent | NDKLongForm;
    let articlePromise: Promise<NDKEvent | NDKLongForm | null> | undefined;



    let loadedId: string;

    let content: string = '';
    let unmarkedContent: string = '';

    $: if (naddr !== loadedId) {
        loadedId = naddr;
        try {
            articlePromise = new Promise(async (resolve, reject) => {
                const e = await $ndk.fetchEvent(naddr);
                if (!e) return reject("Unable to fetch event");

                if (e.kind === NDKKind.LongForm) {
                    article = new NDKLongForm($ndk, e.rawEvent());
                    const md = new MarkdownIt();
                    md.linkify?.set();
                    unmarkedContent = md.render(article.content);
                    content = unmarkedContent;
                } else {
                    article = e;

                    content = article.content;
                    unmarkedContent = article.content;
                }
                resolve(article);
            });
        } catch (e) {
            console.error(`layout error`, e);
        }
    }

    // Load article
    // $: if (type === 'note' || type === 'nevent' && !loadedId) {
    //     loadedId = articleId;
    //     console.log('fetching', articleId);
    //     setTimeout(async () => {
    //         const e = await $ndk.fetchEvent({ids: [articleId]});

    //         if (!e) return;

    //         try {
    //             if (e.kind === 1) {
    //                 article = {
    //                     id: e.id,
    //                     title: "",
    //                     tags: e.tags,
    //                     publisher: e.pubkey,
    //                     author: e.pubkey,
    //                     content: e.content,
    //                     event: JSON.stringify(e.rawEvent()),
    //                 } as App.Article;
    //                 console.log('article', article);
    //                 articleEvent = e;
    //                 content = e.content;
    //             } else {
    //                 articleEvent = e;
    //             }
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     });
    // }

    // $: if (type === 'naddr' && !loadedId) {
    //     loadedId = articleId;
    //     $ndk.fetchEvent(filterFromNaddr(naddr)).then(e => {
    //         if (!e) {
    //             console.log('unable to find', naddr, filterFromNaddr(naddr))
    //             return;
    //         }

    //         articleEvent = e;
    //         article = articleFromEvent(e);
    //         const md = new MarkdownIt();
    //         md.linkify?.set();
    //         unmarkedContent = md.render(article.content);
    //         content = unmarkedContent;
    //     });
    // }
</script>

{#await articlePromise}
    <Card size="full relative">
        <Card class="text-center flex flex-row gap-4 items-center absolute z-50 md:p-8" style="top: 40%; left: 40%;">
            <h1 class="text-xl">
                Loading article...
            </h1>
        </Card>

        <div  class="flex flex-col items-start">
            <TestimonialPlaceholder />
        </div>

        <Skeleton size='xxl' class='mt-8'/>
        <Skeleton size='xxl' class='mt-8'/>
        <Skeleton size='xxl' class='mt-8'/>
    </Card>
{:then article}
    {#if article.kind === 9735}
        <Reader {article}>
            <ZapEventCard draggable={false} event={article} skipFooter={false}  />
        </Reader>
    {:else}
        <Reader
            {article}
            {content}
            {unmarkedContent}
        />
    {/if}
{:catch}
    <Card size="full">
        <div class="text-center">
            <h1>Article not found</h1>
            <p>Unable to find article with id {naddr}</p>
        </div>
    </Card>
{/await}
