<script lang="ts">
    import ArticleTitle from "./ArticleTitle.svelte";
    import ArticlePreview from "./ArticlePreview.svelte";
    import { goto } from "$app/navigation";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import { onDestroy, onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import ndk from "$lib/stores/ndk";
    import Textarea from '$lib/components/Textarea.svelte';
    import { addLongForm, removeLongForm, isSaved as isLongFormSaved } from "$lib/stores/long-form";
    import type { NDKList } from "@nostr-dev-kit/ndk";
    import Toolbar from "./Toolbar.svelte";

    export let event: NDKArticle;

    let title: string = event?.title ?? "Untitled";

    let body: string = event?.content || "";
    let visibility = event?.kind === 30023 ? 'Public' : 'Secret';
    let showInsert = true;

    let previewMode = false;

    let selectedItem: NDKList;

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
        event.published_at = undefined;

        event.created_at = Math.floor(Date.now() / 1000);

        if (visibility === 'Secret') {
            event.kind = 31023;
            event.title = await $ndk.signer!.encrypt($currentUser!, title);

            await event.encrypt($currentUser!);
        }

        await event.sign();
        await event.publish();

        goto(`/notes`);
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

<div class="flex flex-row items-center justify-between lg:hidden static z-50 w-full bottom-0 py-2 px-4 pt-2">
    <Toolbar
        bind:event
        bind:visibility={visibility}
        bind:previewMode={previewMode}
        on:save={save}
    />
</div>

<div class="flex flex-row gap-8 overflow-y-auto h-full min-h-screen">
    <div
        class="flex flex-col h-full w-full lg:w-1/2 gap-4"
        class:hidden={previewMode}
    >
        <div class="card card-compact">
            <div class="flex-row items-center justify-between hidden lg:flex z-50 w-full py-2 px-4 pt-2">
                <Toolbar
                    bind:event
                    bind:visibility={visibility}
                    bind:previewMode={previewMode}
                    bind:showInsert
                    on:save={save}
                />
            </div>
            <div class="divider my-0"></div>
                <div class="card-body" class:hidden={previewMode}>
                    <div class="flex flex-col gap-8 flex-grow">
                        <div class="card card-compact flex-grow !rounded-xl">
                            <div class="card-body flex-col-reverse lg:flex-col">
                                <div class="flex-grow flex flex-col">
                                    <ArticleTitle
                                            bind:title
                                            on:keydown={onTitleKeyDown}
                                            on:keyup={onTitleKeyUp}
                                            on:change={onTitleKeyUp}
                                            class="px-0 text-base-100-content"
                                        />
                                    <Textarea
                                        bind:this={bodyEl}
                                        class="w-full border-0
                                            flex-grow
                                            h-full
                                            bg-transparent
                                            focus:ring-0 focus:border-0
                                            focus:!border-none
                                            placeholder-base-300-contrast
                                            text-base-100-content
                                            px-0
                                        "
                                        placeholder="Start writing..."
                                        bind:value={body}
                                        on:change={onBodyChange}
                                        on:keyup={onBodyChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {#if showInsert}
                <div class="card card-compact h-1/2">
                    <div class="card-body">
                        here
                    </div>
                </div>
            {/if}
        </div>
    <div
        class="lg:block lg:w-1/2 w-full"
        class:hidden={!previewMode}
    >
        <ArticlePreview
            {title}
            {body}
            tags={event.tags}
            skipEditButton={true}
            article={event}
        />
    </div>
</div>