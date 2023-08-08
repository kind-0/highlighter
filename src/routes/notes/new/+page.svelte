<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentUser } from "$lib/store";
    import { addLongForm } from "$lib/stores/long-form";

    import ndk from "$lib/stores/ndk";
    import type { NostrEvent } from "@nostr-dev-kit/ndk";
    import { NDKArticle } from "@nostr-dev-kit/ndk";

    $: if ($currentUser) {
        let event = new NDKArticle($ndk, {
            kind: 31023,
            pubkey: $currentUser.hexpubkey(),
            created_at: Math.floor(Date.now() / 1000),
        } as NostrEvent);

        addLongForm(event);

        goto(`/notes/${event.encode()}/edit`);
    }
</script>

