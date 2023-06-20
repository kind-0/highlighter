<script lang="ts">
    import RoundedButton from "$lib/components/RoundedButton.svelte";
    import { NDKNip46Signer, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";
    import ndk, {bunkerNDK} from '$lib/stores/ndk';
    import { closeModal } from "svelte-modals";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import { fetchFollowers } from '$lib/currentUser';

    import ModalWrapper from "$lib/components/ModalWrapper.svelte";
    import Input from "$lib/components/Input.svelte";

    let connectionString = '';

    let connectionStatus: string | undefined = undefined;

    onMount(() => {
        $bunkerNDK.connect(2500);
    });

    async function nip46Login() {
        connectionStatus = 'Requesting permission';

        // check if there is a private key stored in localStorage
        const existingPrivateKey = localStorage.getItem('nostr-nsecbunker-key');
        let localSigner: NDKPrivateKeySigner | undefined = undefined;

        if (existingPrivateKey) {
            localSigner = new NDKPrivateKeySigner(existingPrivateKey);
        } else {
            localSigner = NDKPrivateKeySigner.generate();
        }

        try {
            const remoteSigner = new NDKNip46Signer($bunkerNDK, connectionString, localSigner);
            await remoteSigner.blockUntilReady();

            if (!existingPrivateKey) {
                localStorage.setItem('nostr-nsecbunker-key', remoteSigner.localSigner.privateKey!);
            }

            connectionStatus = 'Authorized';
            $ndk.signer = remoteSigner;
            $currentUser = await remoteSigner.user();
            $currentUser.ndk = $ndk;
            localStorage.setItem('nostr-key-method', 'nip46');
            localStorage.setItem('nostr-target-npub', $currentUser.npub);
            fetchFollowers();
            console.log('Logged in as', $currentUser);
        } catch (e: any) {
            connectionStatus = e;
        }

        setTimeout(() => {
            closeModal();
        }, 1000);
    }
</script>

<ModalWrapper>
    <h1>Login using nsecBunker</h1>

    <Input type="text" placeholder="npub or connection token" bind:value={connectionString} klass="font-mono" />

    <RoundedButton on:click={nip46Login}>
        {#if !connectionStatus}
            Sign in
        {:else}
            {connectionStatus}
        {/if}
    </RoundedButton>
</ModalWrapper>

