<script lang="ts">
    import UserInterface from '$lib/interfaces/users';
    import type { Observable } from 'dexie';

    import ndk from '$lib/stores/ndk';

    import { getContext } from 'svelte';
    import {Name} from '@nostr-dev-kit/ndk-svelte-components';
    import type { NDKUser } from '@nostr-dev-kit/ndk';

    export let pubkey: string | undefined = undefined;
    export let user: NDKUser | undefined = undefined;
    export let userProfile: App.UserProfile | undefined = undefined;

    getContext('ndk');

    let prevPubkey: string | undefined = undefined;

    let defaultName = `[${pubkey?.slice(0, 5)}]`;;

    let observeUserProfile: Observable<App.UserProfile> | undefined = undefined;
    let name: string | undefined = userProfile?.displayName;

    $: {
        if (pubkey !== prevPubkey && !userProfile) {
            prevPubkey = pubkey;
            observeUserProfile = UserInterface.get({ hexpubkey: pubkey });
        }

        if (observeUserProfile && $observeUserProfile) {
            userProfile = ($observeUserProfile||{}) as App.UserProfile;
        }

        defaultName = `[${pubkey?.slice(0, 5)}]`;
        name = userProfile?.displayName || userProfile?.name || defaultName;
    }
</script>

<Name
    ndk={$ndk}
    {pubkey}
    {user}
    class={$$props.class}
    on:click
/>