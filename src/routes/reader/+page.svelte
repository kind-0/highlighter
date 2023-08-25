<script lang="ts">
    import RecentlyCurated from "$components/Curations/RecentlyCurated.svelte";
    import NewContent from "$components/Curations/NewContent.svelte";
    import Section from "$components/Section.svelte";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import { fade } from "svelte/transition";
    import { loadingScreen } from "$stores/session";
    import { onMount } from "svelte";

    let renderNewContent = false;
    let newContentItems: NDKArticle[];
    let newContentArticlesToRender: number;
    let newContentExpanded = false;

    onMount(() => {
        newContentEose();
    })

    function newContentEose() {
        renderNewContent = renderNewContent || (
            newContentItems.length >= newContentArticlesToRender
        );

        if (renderNewContent) {
            $loadingScreen = false;
        }
    }
</script>

<div class="flex flex-col gap-8">
    <div class:hidden={!renderNewContent} transition:fade>
        <Section
            title="Highlighter Fresh"
        >
            <div slot="actions">
                <button class="btn btn-ghost font-light"
                    on:click={() => {
                        newContentArticlesToRender += 10;
                        newContentExpanded = !newContentExpanded;
                    }}
                >
                    View
                    {#if newContentExpanded}
                        Less
                    {:else}
                        More
                    {/if}
                </button>
            </div>
            {newContentArticlesToRender}
            <NewContent
                bind:items={newContentItems}
                bind:articlesToRender={newContentArticlesToRender}
                on:ready={newContentEose}
                expanded={newContentExpanded}
            />
        </Section>
    </div>

    <Section
        title="Recently Curated"
    >
        <RecentlyCurated />
    </Section>

    <Section
        title="Popular Content"
    >
        <RecentlyCurated />
    </Section>
</div>