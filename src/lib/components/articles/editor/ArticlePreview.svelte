<script lang="ts">
    import Article from "$lib/components/Article.svelte";
    import CardContent from '$lib/components/events/content.svelte';
    import type NDKLongForm from "$lib/ndk-kinds/long-form";
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import { Card } from "flowbite-svelte";
    import { throttle } from 'throttle-debounce';

    export let title: string;
    export let body: string;
    export let tags: NDKTag[];

    let renderedContent = body;

    const updateRenderedContent = () => {
        renderedContent = body;
    };

    $: if (body || !body) updateRenderedContent();

</script>

<Card size="xl" class="max-w-3xl md:px-12 md:py-12">
    <article class="flex flex-col gap-4 md:gap-8">
        <h1 class="md:text-4xl text-zinc-800 font-black text-left mt-0">{title}</h1>
            <div class="article">
                <CardContent
                    note={renderedContent}
                    {tags}
                />
            </div>
    </article>
</Card>
