<script lang="ts">
	import { rightDrawerContent } from '$lib/stores/right-drawer';
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    import ndk from '$lib/stores/ndk';

    import Time from "svelte-time";
    import EventCardActions from "./EventCardActions.svelte";
    import Avatar from "../Avatar.svelte";
    import { Name } from "@nostr-dev-kit/ndk-svelte-components";
    import EventCardDropdown from "./EventCardDropdown.svelte";

    export let event: NDKEvent;
    export let authorAction: string | undefined = undefined;
    export let skipHeader = false;
    export let skipFooter = false;

    /**
     * Whether this event should be expandible so that clicking on it
     * will open a thread view
     */
    export let expandible = true;

    function useRelativeTime() {
        const now = Date.now();
        const diff = now - event.created_at*1000;

        return diff < 1000*60*60*24;
    }

    function linkToEvent() {
        return `/e/${event.encode()}`;
    }

    let deleted = false;

    function toggleDrawer(e: MouseEvent) {
        const { target } = e;

        // if target is an <a> or <button> return
        if (target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement) {
            return;
        }


        $rightDrawerContent = event;
    }
</script>

{#if !deleted}
    <div class="
        card card-compact !rounded-none md:!rounded-2xl group {$$props.class??""}
    " on:mouseenter on:mouseleave on:click={toggleDrawer}>
        <div class="card-body flex flex-col text-base gap-4">
            {#if !skipHeader}
                <div class="flex flex-row justify-between gap-4 md:gap-12">
                    <slot name="header" />

                    <div class="flex flex-row items-center gap-4">
                        <div class="md:opacity-10 group-hover:opacity-100">
                            <EventCardDropdown
                                {event}
                                on:deleted={() => deleted = true}
                            />
                        </div>

                        {#if event.created_at}
                            <a href={linkToEvent()}>
                                <Time
                                    relative={useRelativeTime()}
                                    timestamp={event.created_at*1000}
                                    class="text-sm whitespace-nowrap"
                                />
                            </a>
                        {/if}
                    </div>
                </div>
            {/if}

            <slot />

            {#if !skipFooter && !$$slots.footer}
                <div class="flex flex-row items-center justify-between">
                    <a
                        href="/p/{event.author.npub}"
                        class="flex flex-row items-center gap-2 text-sm"
                    >
                        <Avatar user={event.author} size="small" />
                        <div class="text-xs hidden md:block">
                            {#if authorAction}
                                <span>
                                    {authorAction}
                                </span>
                            {/if}

                            <span
                                class="text-xs font-semibold"
                            >
                                <Name ndk={$ndk} user={event.author} />
                            </span>
                        </div>
                    </a>


                    <div>
                        <EventCardActions {event} />
                    </div>
                </div>
            {:else if !skipFooter}
                <slot name="footer" />
            {/if}
        </div>
    </div>
{/if}

<style>
    .card.card-compact .card-body {
        @apply text-base;
    }
</style>