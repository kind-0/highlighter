<script lang="ts">
    import type NDKLongForm from "$lib/ndk-kinds/long-form";

    import RoundedButton from "$lib/components/RoundedButton.svelte";
    import EventVisibility from "$lib/components/events/editor/EventVisibility.svelte";

    import ArticleTitle from "./ArticleTitle.svelte";
    import ArticleEditorBody from "./ArticleEditorBody.svelte";
    import MarkdownIt from 'markdown-it';
    import ArticlePreview from "./ArticlePreview.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$lib/stores/ndk";

    export let event: NDKLongForm;

    let title: string = event?.title || "";

    // let dTag: string = event?.tagValue('d') || "";
    let body: string = event?.content || "";
    let markdownContent = '';
    let visibility = event?.kind === 31023 ? 'Secret' : 'Public';

    onMount(() => {
        title = event.title || "";
    });

    const md = new MarkdownIt();
    md.linkify?.set();

    async function onBodyChange() {
        event.content = body;

        // remove all non-d tags
        event.tags = event.tags.filter(tag => tag[0] === 'd');

        if (event.content.length > 0)
            markdownContent = md.render(event.content);
        else
            markdownContent = "";
    }

    async function save() {
        event.title = title;
        event.content = body;

        // if (!event.id && visibility === 'Public') {
        //     const dTag = dTagFromString(title);
        //     event.tags = event.tags.filter(tag => tag[0] !== 'd');
        //     event.tags.push(['d', dTag]);
        // }

        event.created_at = Math.floor(Date.now() / 1000);
        console.log(event.rawEvent());

        if (visibility === 'Secret') {
            event.kind = 31023;
            event.title = await $ndk.signer!.encrypt($currentUser!, title);

            console.log(`setting title to ${event.title}`, event.rawEvent().tags);

            await event.encrypt($currentUser!);
        }

        await event.sign();
        await event.publish();

        goto(`/my/notes/${event.encode()}`);
    }
</script>

<div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/2">
        <div class="flex flex-col gap-8">
            <ArticleTitle bind:title />

            <ArticleEditorBody bind:value={body} on:change={onBodyChange} />

            <div class="flex flex-row justify-between">
                <div>
                    {#if !event.id}
                        <EventVisibility bind:value={visibility} />
                    {:else}
                        <b>Visibility:</b>
                        {visibility}
                    {/if}
                </div>

                <div>
                    <RoundedButton
                        on:click={save}
                    >
                        Save
                    </RoundedButton>
                </div>
            </div>
        </div>
    </div>

    <div class="lg:w-1/2">
        {#key body}
            <ArticlePreview
                {title}
                {body}
                tags={event.tags}
            />
        {/key}
    </div>
</div>