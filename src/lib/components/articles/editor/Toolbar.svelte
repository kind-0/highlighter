<script lang="ts">
    import ButtonWithBorderGradient2 from "$lib/components/buttons/ButtonWithBorderGradient2.svelte";
    import EventVisibility from "$lib/components/events/editor/EventVisibility.svelte";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { CaretDown } from "phosphor-svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let event: NDKEvent;
    export let previewMode: boolean;
    export let showInsert: boolean;
    export let visibility: string;
</script>

<div class="flex flex-row items-center justify-between fixed md:static z-50 w-full bottom-0 py-2 px-4 pt-2">
    {#if !event.sig}
        <EventVisibility
            placement="top"
            class="whitespace-nowrap bg-base-300 border-none !rounded-full"
            bind:value={visibility}
        />
    {/if}

    <button class="btn bg-base-300 !rounded-full" on:click={() => { showInsert = !showInsert}}>
        Insert
    </button>

    <button class="btn bg-base-300 lg:hidden" on:click={() => previewMode = !previewMode}>
        Preview
    </button>

    <ButtonWithBorderGradient2
        on:click={() => {dispatch('save')}} rounded="rounded-r-full"
    >
        Save
    </ButtonWithBorderGradient2>
</div>