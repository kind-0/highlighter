<script lang="ts">
    import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/store';
    import { setupPlaceholderProfile } from './LoginModal/placeholder-profile';
    import KeyIcon from '$lib/icons/Key.svelte';

    async function loginAsGuest() {
        const pk = NDKPrivateKeySigner.generate();
        $ndk.signer = pk;
        $currentUser = await $ndk.signer.user();

        localStorage.setItem('nostr-key-method', 'pk');
        localStorage.setItem('nostr-key', pk.privateKey!);
        localStorage.setItem('nostr-target-npub', $currentUser.npub);

        setupPlaceholderProfile();
    }
</script>

<div on:click={loginAsGuest} class="btn w-full h-11 bg-base-100 rounded-full border-2 border-accent2 btn-rounded-full">
    <div class="flex items-center gap-2">
        <KeyIcon />
        <div class="text-center text-base-100-content text-xs font-medium normal-case">Continue as Guest</div>
    </div>
</div>

<style>
    .btn {
        box-shadow: 0px 0px 5px 1px #817eff;
    }
</style>
