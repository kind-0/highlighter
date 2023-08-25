<script lang="ts">
    import AvatarWithName from "$components/AvatarWithName.svelte";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import ContentCard from "./ContentCard.svelte";
    import LongForm from "$icons/LongForm.svelte";
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

{#await authorPromise}
    <div class="h-64 flex items-center justify-center">
        <span class="loading loading-lg"></span>
    </div>
{:then}
    <ContentCard
        title={article.title}
        summary={article.tagValue("summary")}
        image={article.image}
        url={`/a/${article.encode()}`}
        event={article}
    >
        <LongForm slot="icon" class="w-7 h-7" />
        <AvatarWithName
            slot="footer"
            pubkey={article.pubkey}
            avatarClass="w-7 h-7"
            nameClass="text-base-100-content" />
    </ContentCard>
{/await}
