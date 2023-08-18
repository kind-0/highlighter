<script lang="ts">
    import AvatarWithName from "$components/AvatarWithName.svelte";
    import type { NDKArticle } from "@nostr-dev-kit/ndk";
    import ContentCard from "./ContentCard.svelte";
    import LongForm from "$icons/LongForm.svelte";
    
    export let article: NDKArticle;

</script>

<ContentCard title={article.title} summary={article.summary} image={article.image}>
    <LongForm slot="icon" class="w-7 h-7" />
    <AvatarWithName slot="footer" pubkey={article.pubkey} avatarClass="w-7 h-7" nameClass="text-base-100-content" />
</ContentCard>