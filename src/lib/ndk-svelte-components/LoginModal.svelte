<script lang="ts">
    import { NDKNip46Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
    import ndk, {bunkerNDK} from '$lib/stores/ndk';
    import { closeModal } from "svelte-modals";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import { fetchFollowers } from '$lib/currentUser';

    import Alert from "$lib/components/Alert.svelte";
    import ModalWrapper from "$lib/components/ModalWrapper.svelte";
    import Button from "$lib/components/buttons/Button.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { login } from "$lib/utils/login";

    let nip46ConnectionString = '';
    let nip46ConnectionStatus: string | undefined = undefined;
    let nip46ConnectionInfo: string | undefined = undefined;

    let nip46requestTimeout: NodeJS.Timeout | undefined = undefined;

    onMount(() => {
        $bunkerNDK.connect(2500);
    });

    async function loginNip46() {
        if (!nip46ConnectionString) return;

        nip46ConnectionStatus = 'Requesting permission';

        nip46requestTimeout = setTimeout(() => {
            nip46ConnectionInfo = 'long-time';
        }, 5000);

        // check if there is a private key stored in localStorage
        const existingPrivateKey = localStorage.getItem('nostr-nsecbunker-key');
        let localSigner: NDKPrivateKeySigner;

        if (existingPrivateKey) {
            localSigner = new NDKPrivateKeySigner(existingPrivateKey);

            if (!localSigner.privateKey) {
                localSigner = NDKPrivateKeySigner.generate();
            }
        } else {
            localSigner = NDKPrivateKeySigner.generate();
        }

        nip46ConnectionStatus = localSigner.privateKey;

        try {
            const remoteSigner = new NDKNip46Signer($bunkerNDK, nip46ConnectionString, localSigner);
            await remoteSigner.blockUntilReady();

            if (!existingPrivateKey) {
                localStorage.setItem('nostr-nsecbunker-key', localSigner.privateKey!);
            }

            nip46ConnectionStatus = 'Authorized';
            $ndk.signer = remoteSigner;
            $currentUser = await remoteSigner.user();
            $currentUser.ndk = $ndk;
            localStorage.setItem('nostr-key-method', 'nip46');
            localStorage.setItem('nostr-target-npub', $currentUser.npub);
            fetchFollowers();

            setTimeout(() => { closeModal(); }, 1000);
        } catch (e: any) {
            nip46ConnectionInfo = e;
        }
    }

    async function loginAsGuest() {
        const pk = NDKPrivateKeySigner.generate();
        $ndk.signer = pk;
        $currentUser = await $ndk.signer.user();

        localStorage.setItem('nostr-key-method', 'pk');
        localStorage.setItem('nostr-key', pk.privateKey!);
        localStorage.setItem('nostr-target-npub', $currentUser.npub);

        closeModal();
    }

    async function loginNip07() {
        const user = await login($ndk, undefined, 'nip07');

        if (!user) {
            alert('Login failed');
        } else {
            $currentUser = user;
            localStorage.setItem('nostr-key-method', 'nip07');
            localStorage.setItem('nostr-target-npub', $currentUser.npub);

            closeModal();
        }
    }

    let mode: string | undefined;
</script>

<ModalWrapper class="md:max-w-2xl !bg-transparent shadow-none">
    <div class="flex flex-col lg:flex-row items-stretch gap-4">
        {#if !mode}
            <div class="flex flex-col bg-white gap-4 p-4 lg:w-1/2 rounded-xl">
                <div class="text-xl font-semibold">
                    New to Nostr?
                </div>

                <Button on:click={loginAsGuest}>
                    Continue as guest
                </Button>
            </div>

            <div class="flex flex-col bg-white gap-4 p-4 rounded-xl">
                <div class="text-xl font-semibold">
                    Already have an account?
                </div>

                <Button on:click={() => { mode = 'login' }}>
                    Login
                </Button>
            </div>
        {:else}
        <div class="flex flex-col w-full gap-4">
            <div class="bg-white shadow sm:rounded-lg rounded-xl">
                <div class="px-4 py-5 sm:p-6">
                    <div class="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Nostr Extension</h3>
                            <div class="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Use a browser extension, like getAlby or nos2x, to login.</p>
                            </div>
                        </div>
                        <div class="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                            <Button
                                type="secondary"
                                on:click={loginNip07}
                                class="w-full lg:w-fit"
                            >Browser Extension login</Button>
                        </div>
                    </div>
                </div>
            </div>


            <div class="bg-white shadow sm:rounded-lg rounded-xl">
                <div class="px-4 py-5 sm:p-6">
                    <div class="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900">nsecBunker</h3>
                            <div class="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Use an nsecBunker to login remotely.</p>
                            </div>
                        </div>
                        <div class="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                            <Button
                                type="secondary"
                                on:click={() => { mode = 'nsecbunker'; }}
                                class="w-full lg:w-fit"
                            >nsecBunker Login</Button>
                        </div>
                    </div>

                    {#if mode === 'nsecbunker'}
                        <div class="">
                            {#if nip46ConnectionInfo}
                                <Alert type="warning" class="mb-4">
                                    {#if nip46ConnectionInfo === 'long-time'}
                                        <p class="text-base">This request is taking longer than it should.</p>

                                        <ul class="list-disc list-inside">
                                            <li>Is your nsecBunker running?</li>
                                            <li>is your nsecBunker asking for permission to allow this connection?</li>
                                        </ul>
                                    {:else}
                                        {nip46ConnectionInfo}
                                    {/if}
                                </Alert>
                            {:else}
                                <Alert type="info" class="mb-4">
                                    Enter your npub or a connection string as provided by your nsecBunker.
                                </Alert>
                            {/if}

                            <Textarea
                                bind:value={nip46ConnectionString}
                                class="w-full font-mono text-sm rounded-b-none"
                                placeholder={"Enter connection string"}
                            />

                            <Button type="secondary" class="!rounded-t-none w-full" on:click={loginNip46}>
                                {nip46ConnectionStatus??"Login"}
                            </Button>
                        </div>
                    {/if}
                </div>
            </div>

        </div>

        {/if}
    </div>
</ModalWrapper>

