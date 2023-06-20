<script lang="ts">
    import ArticleEditor from "$lib/components/articles/editor/ArticleEditor.svelte";
    import NDKLongForm from "$lib/ndk-kinds/long-form";

    import ndk from "$lib/stores/ndk";
    import type { NostrEvent } from "@nostr-dev-kit/ndk";

    let event = new NDKLongForm($ndk, { kind: 31023 } as NostrEvent);
</script>

<ArticleEditor bind:event />
