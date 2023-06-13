<script lang="ts">
    import {  Heading, Mark, Span } from 'flowbite-svelte'
    import ndk from "$lib/stores/ndk";
    import { NDKKind } from "$lib/ndk-kinds";
    import { currentUser } from "$lib/store";
    import { onMount } from "svelte";

    let show: boolean | undefined = undefined;

    onMount(async () => {
        const hasDismissed = localStorage.getItem('new-highlights-instruction-dismissed');
        if (hasDismissed) {
            show = false;
            return;
        }

        show = await checkForHighlightingEvent();
    })

    async function checkForHighlightingEvent(): Promise<boolean> {
        if (!$currentUser) { return false; }

        const event = await $ndk.fetchEvent({
            kinds: [NDKKind.Highlight],
            authors: [$currentUser.hexpubkey()],
            limit: 1
        });

        return !event;
    }

    function dismiss() {
        localStorage.setItem('new-highlights-instruction-dismissed', 'true');
        show = false;
    }
</script>

{#if show}
    <div class="border-l-4 border-orange-400 bg-orange-50 p-4">
        <div class="flex">
            <div class="ml-3">
                <Heading tag="h4">
                    <span class="text-orange-500">
                        Highlighting popup here
                    </span>
                </Heading>
                <p class="text-base text-zinc-700">
                    Select text on this page to create highlights and annotations.
                </p>

                <button class="
                    bg-orange-500 hover:bg-orange-600 text-sm text-white px-6 py-2 rounded-md mt-4
                    transition duration-200 ease-in-out
                " on:click={dismiss}>
                    Dismiss
                </button>
            </div>

        </div>
    </div>

    <hr class="my-4">
{/if}
