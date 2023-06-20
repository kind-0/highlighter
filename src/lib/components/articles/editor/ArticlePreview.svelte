<script lang="ts">
    import CardContent from '$lib/components/events/content.svelte';
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import { Card } from "flowbite-svelte";
    import MarkdownIt from 'markdown-it';

    export let title: string;
    export let body: string;
    export let tags: NDKTag[];
    export let href: string | undefined = undefined;

    const md = new MarkdownIt();
    md.linkify?.set();

    let renderedContent = body;
    let renderedContentBeforeMarkdown = "";

    $: if (renderedContentBeforeMarkdown !== body) {
        renderedContentBeforeMarkdown = body;
        renderedContent = md.render(body);
    }

</script>

<Card {href} size="xl" class="max-w-3xl md:px-12 md:py-12 {$$props.class??""}">
    <article class="flex flex-col gap-4 md:gap-8">
        <h1 class="md:text-4xl text-zinc-800 font-black text-left mt-0 {$$props.titleClass??""}">{title}</h1>
            <div class="article">
                <CardContent
                    note={renderedContent}
                    {tags}
                />
            </div>
    </article>
</Card>
