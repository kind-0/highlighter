<script lang="ts">
    import AvatarWithName from "$components/AvatarWithName.svelte";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let article: NDKArticle;

    const author = article.author;
    const authorPromise = new Promise<void>((resolve) => {
        author.fetchProfile().then(() => {
            dispatch("author-loaded");
            resolve();
        });
    });
</script>

{#await author.fetchProfile()}
    <div class="h-64 flex items-center justify-center">
        <span class="loading loading-lg"></span>
    </div>
{:then}
    <div class="flex flex-col gap-4">
        <a
            class="card card-compact image-full h-64"
            href="/a/{article.encode()}"
        >
            <figure>
                {#if article.tagValue('image')}
                    <img src={article.tagValue('image')} />
                {:else}
                    <img src="https://nostr.build/p/6KgW.png" />
                {/if}
            </figure>
            <div class="card-body">
                {article.title}
            </div>
        </a>

        <AvatarWithName
            class="flex-1"
            pubkey={article.pubkey}
            avatarClass="w-6 h-6"
        />
    </div>
{/await}