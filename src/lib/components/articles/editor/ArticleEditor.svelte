<script lang="ts">
    import type NDKLongForm from "$lib/ndk-kinds/long-form";

    import EventVisibility from "$lib/components/events/editor/EventVisibility.svelte";

    import ArticleTitle from "./ArticleTitle.svelte";
    import ArticlePreview from "./ArticlePreview.svelte";
    import { goto } from "$app/navigation";
    import { onDestroy, onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$lib/stores/ndk";
    import { Card } from "flowbite-svelte";
    import Textarea from '$lib/components/Textarea.svelte';
    import Button from "$lib/components/buttons/Button.svelte";
    import { addLongForm, removeLongForm, isSaved as isLongFormSaved } from "$lib/stores/long-form";
    import Article from "$lib/components/Article.svelte";

    export let event: NDKLongForm;

    let title: string = event?.title ?? "Untitled";

    let body: string = event?.content || "";
    let visibility = event?.kind === 30023 ? 'Public' : 'Secret';

    onMount(() => {
        title = event.title || "";
    });

    onDestroy(() => {
        if (!isLongFormSaved(event)) {
            if (event.content.length < 10)
                removeLongForm(event);
        }
    });

    $: event.kind = visibility === 'Public' ? 30023 : 31023;

    async function save() {
        event.title = title;
        event.content = body;

        event.created_at = Math.floor(Date.now() / 1000);

        if (visibility === 'Secret') {
            event.kind = 31023;
            event.title = await $ndk.signer!.encrypt($currentUser!, title);

            await event.encrypt($currentUser!);
        }

        await event.sign();
        await event.publish();

        goto(`/my/notes`);
    }

    let bodyEl;

    function onTitleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            // move focus to body
            bodyEl.focus = true;
        }
    }

    function onTitleKeyUp() {
        event.title = title;
        addLongForm(event, true);
    }

    function onBodyChange() {
        event.content = body;
        body = body
        addLongForm(event, true);
    }
</script>

<div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/2">
        <div class="flex flex-col gap-8">
            <Card size="xl" class="w-full">
                <ArticleTitle
                    bind:title
                    on:keydown={onTitleKeyDown}
                    on:keyup={onTitleKeyUp}
                    on:change={onTitleKeyUp}
                    class="px-0"
                />

                <Textarea
                    bind:this={bodyEl}
                    class="w-full border-0
                        focus:ring-0 focus:border-0
                        placeholder-zinc-300
                        px-0
                    "
                    placeholder="Start writing..."
                    bind:value={body}
                    on:change={onBodyChange}
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
                    <Button on:click={save} class="px-8">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <div class="lg:w-1/2">
        <ArticlePreview
            {title}
            {body}
            tags={event.tags}
            skipEditButton={true}
            article={event}
        />
    </div>
</div>