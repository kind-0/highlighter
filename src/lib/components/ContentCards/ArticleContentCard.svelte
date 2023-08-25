<script lang="ts">
    import AvatarWithName from "$components/AvatarWithName.svelte";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import ContentCard from "./ContentCard.svelte";
    import LongForm from "$icons/LongForm.svelte";
    
    export let article: NDKArticle;

</script>

<ContentCard title={article.title} summary={article.tagValue("summary")} image={article.image} event={article}>
    <LongForm slot="icon" class="w-7 h-7" />
    <div slot="footer" class="w-full flex justify-center">
        <div class="truncate">
            <AvatarWithName pubkey={article.pubkey} avatarClass="w-7 h-7" nameClass="text-base-100-content" />
        </div>
    </div>
</ContentCard>