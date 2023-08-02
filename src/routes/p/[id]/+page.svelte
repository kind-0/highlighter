<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import UserInterface from '$lib/interfaces/users';
    import { backgroundBanner } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import type { NDKUser } from '@nostr-dev-kit/ndk';

    let { npub } = $page.data;
    let user: NDKUser;
    let hexpubkey: string;

    if (npub.startsWith('npub')) {
        const user = $ndk.getUser({npub})
        hexpubkey = user.hexpubkey();
    } else {
        hexpubkey = npub;
        user = $ndk.getUser({hexpubkey});
    }

    let userProfile = UserInterface.get({ hexpubkey });

    $: if ($userProfile?.banner) {
        $backgroundBanner = $userProfile?.banner;
    } else {
        $backgroundBanner = null;
    }

    // Temporary hack
    $: if (user) goto(`/p/${user.npub}/highlights`);
</script>
