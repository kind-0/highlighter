<script lang="ts">
    import { NDKNip07Signer, NDKNip46Signer, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";
    import { openModal } from 'svelte-modals';
    import LoginModal from './LoginModal.svelte';
    import { onMount } from "svelte";
    import ndk, { bunkerNDK } from "$lib/stores/ndk";
    import { currentUser } from "$lib/store";
    import { createEventDispatcher } from 'svelte';
    import RoundedButton from "$lib/components/RoundedButton.svelte";

    const dispatch = createEventDispatcher();

    onMount(() => {
        // Check if there is a localStorage item with the key "nostr-key-method"
        const nostrKeyMethod = localStorage.getItem("nostr-key-method");
        switch (nostrKeyMethod) {
            case 'nip07':
                attemptNip07SignIn();
                break;
            case 'nip46':
                const existingPrivateKey = localStorage.getItem('nostr-nsecbunker-key');

                if (existingPrivateKey) {
                    $bunkerNDK.connect(2500);
                    $bunkerNDK.pool.on('relay:connect', () => {
                        attemptNip46SignIn(existingPrivateKey);
                    });
                }

                break;
            default:
                // Attempt to see window.nostr a few times, there is a race condition
                // since the page might begin rendering before the nostr extension is loaded
                let loadAttempts = 0;
                const loadNip07Interval = setInterval(() => {
                    if (window.nostr) {
                        clearInterval(loadNip07Interval);
                        attemptNip07SignIn();
                    }

                    if (loadAttempts++ > 10) clearInterval(loadNip07Interval);
                }, 100);
        }
    });

    // move to NDK's nip-07 signer
    async function attemptNip07SignIn() {
        const storedNpub = localStorage.getItem('currentUserNpub');

        if (storedNpub) {
            $currentUser = new NDKUser({ npub: storedNpub });
            $currentUser.ndk = $ndk;
        }

        if (window.nostr) {
            try {
                $ndk.signer = new NDKNip07Signer();
                $currentUser = await $ndk.signer.user();
                $currentUser.ndk = $ndk;
                localStorage.setItem('currentUserNpub', $currentUser.npub);
                $ndk = $ndk;
                dispatch('signIn');
            } catch (e) {
                openModal(LoginModal);
                console.error('attemptNip07SignIn', e);
            }
        }
    }

    async function attemptNip46SignIn(existingPrivateKey: string) {
        const npub = localStorage.getItem('nostr-target-npub')!;
        const remoteUser = new NDKUser({ npub });
        remoteUser.ndk = $bunkerNDK;

        // check if there is a private key stored in localStorage
        let localSigner: NDKPrivateKeySigner | undefined = undefined;

        if (existingPrivateKey) {
            localSigner = new NDKPrivateKeySigner(existingPrivateKey);
        }

        const remoteSigner = new NDKNip46Signer($bunkerNDK, remoteUser.hexpubkey(), localSigner);

        const user = await remoteSigner.blockUntilReady();
        $ndk.signer = remoteSigner;
        $currentUser = remoteUser;
        $currentUser.ndk = $ndk;
        dispatch('signIn');
    }

    function signIn() {
        const nip07Present = !!window.nostr;

        if (nip07Present) {
            attemptNip07SignIn();
        } else {
            openModal(LoginModal);
        }
    }
</script>

{#if !ndk.signer}
    <RoundedButton on:click={signIn}>
        Sign in
    </RoundedButton>
{/if}
