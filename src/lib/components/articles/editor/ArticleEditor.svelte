<script lang="ts">
    import type NDKLongForm from "$lib/ndk-kinds/long-form";

    import RoundedButton from "$lib/components/RoundedButton.svelte";
    import EventVisibility from "$lib/components/events/editor/EventVisibility.svelte";

    import ArticleTitle from "./ArticleTitle.svelte";
    import MarkdownIt from 'markdown-it';
    import ArticlePreview from "./ArticlePreview.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$lib/stores/ndk";
    import { Card } from "flowbite-svelte";
    import Textarea from '$lib/components/Textarea.svelte';

    export let event: NDKLongForm;

    let title: string = event?.title ?? "Untitled";

    let body: string = event?.content || "";
    let markdownContent = '';
    let visibility = event?.kind === 31023 ? 'Secret' : 'Public';

    onMount(() => {
        title = event.title || "";
    });

    const md = new MarkdownIt();
    md.linkify?.set();

    async function onBodyChange(e: Event) {
        if (body.length > 0)
            markdownContent = md.render(body);
        else
            markdownContent = "";
    }

    async function save() {
        event.title = title;
        event.content = body;

        event.created_at = Math.floor(Date.now() / 1000);
        console.log(event.rawEvent());

        if (visibility === 'Secret') {
            event.kind = 31023;
            event.title = await $ndk.signer!.encrypt($currentUser!, title);

            await event.encrypt($currentUser!);
        }

        await event.sign();
        await event.publish();

        goto(`/my/notes/${event.encode()}`);
    }

    let bodyEl;

    function onTitleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            // move focus to body
            console.log('here');
            bodyEl.focus = true;
        }
    }
</script>

<div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/2">
        <div class="flex flex-col gap-8">
            <Card size="xl" class="w-full">
                <ArticleTitle bind:title on:keydown={onTitleKeyDown} />

                <Textarea
                    bind:this={bodyEl}
                    class="w-full border-0
                        focus:ring-0 focus:border-0
                        placeholder-zinc-300
                    "
                    placeholder="Start writing..."
                    bind:value={body}
                    on:keyup={onBodyChange}
                />
            </Card>

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
        <ArticlePreview
            {title}
            body={markdownContent}
            tags={event.tags}
        />
    </div>
</div>