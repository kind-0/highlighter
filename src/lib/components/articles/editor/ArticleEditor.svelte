<script lang="ts">
    import type NDKLongForm from "$lib/ndk-kinds/long-form";

    import EventVisibility from "$lib/components/events/editor/EventVisibility.svelte";

    import ArticleTitle from "./ArticleTitle.svelte";
    import ArticlePreview from "./ArticlePreview.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$lib/stores/ndk";
    import { Card } from "flowbite-svelte";
    import Textarea from '$lib/components/Textarea.svelte';
    import Button from "$lib/components/buttons/Button.svelte";

    export let event: NDKLongForm;

    let title: string = event?.title ?? "Untitled";

    let body: string = event?.content || "";
    let visibility = event?.kind === 30023 ? 'Public' : 'Secret';

    onMount(() => {
        title = event.title || "";
    });

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
                <ArticleTitle bind:title on:keydown={onTitleKeyDown} class="px-0" />

                <Textarea
                    bind:this={bodyEl}
                    class="w-full border-0
                        focus:ring-0 focus:border-0
                        placeholder-zinc-300
                        px-0
                    "
                    placeholder="Start writing..."
                    bind:value={body}
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
        />
    </div>
</div>