<script lang="ts">
    import UserInterface from '$lib/interfaces/users';
    import type { Observable } from 'dexie';
    import {Avatar} from 'flowbite-svelte';

    export let pubkey: string | undefined = undefined;
    export let userProfile: App.UserProfile | undefined = undefined;
    export let klass: string = '';
    export let size: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    let prevPubkey: string | undefined = undefined;

    let observeUserProfile: Observable<App.UserProfile> | undefined = undefined;
    let image: string | undefined = userProfile?.image;

    $: {
        if (pubkey !== prevPubkey && !userProfile) {
            prevPubkey = pubkey;
            observeUserProfile = UserInterface.get({ hexpubkey: pubkey });
        }

        if (observeUserProfile && $observeUserProfile) {
            userProfile = ($observeUserProfile||{}) as App.UserProfile;
        }

        image = userProfile?.image;
    }
</script>

{#await observeUserProfile}
    <Avatar class={klass||""} {size} />
{:then _userProfile}
    <Avatar src={image} class={`${klass}`} {size} />
{:catch error}
    <Avatar class={klass||""} {size} />
{/await}