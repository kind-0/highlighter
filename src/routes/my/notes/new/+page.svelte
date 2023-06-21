<script lang="ts">
    import { goto } from "$app/navigation";
    import NDKLongForm from "$lib/ndk-kinds/long-form";
    import { currentUser } from "$lib/store";
    import { addLongForm } from "$lib/stores/long-form";

    import ndk from "$lib/stores/ndk";
    import type { NostrEvent } from "@nostr-dev-kit/ndk";

    let event = new NDKLongForm($ndk, {
        kind: 31023,
        pubkey: $currentUser.hexpubkey(),
    } as NostrEvent);

    addLongForm(event);

    goto(`/my/notes/${event.encode()}/edit`);
</script>

