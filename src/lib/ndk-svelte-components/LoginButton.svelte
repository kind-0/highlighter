<script lang="ts">
    import { NDKNip07Signer, NDKNip46Signer, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";
    import { openModal } from 'svelte-modals';
    import LoginModal from './LoginModal.svelte';
    import { onMount } from "svelte";
    import ndk, { bunkerNDK } from "$lib/stores/ndk";
    import { currentUser } from "$lib/store";
    import RoundedButton from "$lib/components/RoundedButton.svelte";
    import { login } from "$lib/utils/login";
    import Button from "$lib/components/buttons/Button.svelte";

    async function signIn() {
        const nip07Present = !!window.nostr;

        if (nip07Present) {
            $currentUser = await login($ndk, $bunkerNDK);
        }

        if (!$currentUser) {
            openModal(LoginModal);
        }
    }
</script>

{#if !$ndk.signer}
    <Button type="primary" class="px-6 w-full" on:click={signIn}>
        Sign in
    </Button>
{/if}
