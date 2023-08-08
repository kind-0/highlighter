<script lang="ts">
    import Article from '$lib/components/Article.svelte';
    import Button from '$lib/components/buttons/Button.svelte';
    import CardContent from '$lib/components/events/content.svelte';
    import LockIcon from '$lib/icons/LockIcon.svelte';
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import MarkdownIt from 'markdown-it';
    import MarkdownItTaskLists from 'markdown-it-task-list-plus';

    export let title: string;
    export let body: string;
    export let tags: NDKTag[];
    export let href: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let skipEditButton = false;
    export let article: NDKArticle;

    const md = new MarkdownIt();
    md.linkify?.set();
    md.use(MarkdownItTaskLists);

    let renderedContent = "";
    let renderedContentBeforeMarkdown = "";
    let rerender = 1;
    let prevLength = 0;

    $: {
        // this is super hacky, but for some reason the <Card> component is preventing re-rendering
        // when dropping in a new tag. This is a workaround to force a re-render.
        if (prevLength > 0 && body.length - prevLength > 40) {
            rerender++;
        }

        prevLength = body.length;
        renderedContentBeforeMarkdown = body;
        renderedContent = md.render(body);
    }

</script>

{#key rerender}
<a {href} img={image} class="max-w-3xl group card {$$props.class??""}" horizontal>
    <div class="card-body flex flex-col gap-2 w-full">
        <div class="flex flex-row gap-4 items-center">
            <Article class="flex flex-col gap-4 md:gap-2">
                <div class="flex flex-row items-start justify-between">
                    <h1 class="md:text-4xl font-bold text-left mt-0 {$$props.titleClass??""}">{title}</h1>

                    <div class="flex flex-row gap-2 items-center">
                        {#if !skipEditButton}
                            <div class="group-hover:opacity-100 opacity-0 transition duration-200">
                                <Button href={`/notes/${article.encode()}/edit`} class="px-8 text-sm">
                                    Edit
                                </Button>
                            </div>
                        {/if}

                        {#if article.kind === 31023}
                            <LockIcon class="w-4 h-4 text-zinc-500" />
                        {/if}
                    </div>
                </div>
                    <div class="article">
                        {#if renderedContent.length > 0}
                            <CardContent
                                note={renderedContent}
                                {tags}
                            />
                        {/if}
                    </div>
            </Article>
        </div>
    </div>
</a>
{/key}