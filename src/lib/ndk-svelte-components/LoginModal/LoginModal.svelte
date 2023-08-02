<script lang="ts">
    import { NDKNip46Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
    import ndk, {bunkerNDK} from '$lib/stores/ndk';
    import { closeModal } from "svelte-modals";
    import { onMount } from "svelte";
    import { currentUser } from "$lib/store";
    import { fetchFollowers } from '$lib/currentUser';

    import ModalWrapper from "$lib/components/ModalWrapper.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { login } from "$lib/utils/login";
    import { setupPlaceholderProfile } from "./placeholder-profile";

    let nip46ConnectionString = '';
    let nip46ConnectionStatus: string | undefined = undefined;
    let nip46ConnectionInfo: string | undefined = undefined;

    let nip46requestTimeout: NodeJS.Timeout | undefined = undefined;

    let noNip07extenion: boolean;

    onMount(() => {
        $bunkerNDK.connect(2500);
    });

    $: noNip07extenion = !window.nostr;

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

        setupPlaceholderProfile();

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

<ModalWrapper class="w-full max-w-xl">
    <div class="card rounded-xl shadow-xl">
        <div class="card-body">
            {#if !mode}
                <div class="flex flex-col w-full lg:flex-row gap-8">
                    <div class="flex flex-grow card bg-base-300 rounded-box place-items-center lg:w-1/2">

                        <div class="text-lg font-semibold uppercase mb-8 whitespace-nowrap">
                            New to Nostr?
                        </div>

                        <button class="w-full btn whitespace-nowrap btn-primary" on:click={loginAsGuest}>
                            Continue as guest
                        </button>
                    </div>
                    <div class="divider lg:divider-horizontal">OR</div>
                    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center lg:w-1/2">

                        <div class="text-lg font-semibold uppercase mb-8 whitespace-nowrap">
                            Have an account?
                        </div>

                        <button class="w-full btn whitespace-nowrap btn-primary" on:click={() => { mode = 'login' }}>
                            Login
                        </button>
                    </div>
                </div>
            {:else}
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-4">
                        <h3 class="text-xl font-semibold">Nostr Extension</h3>
                        {#if noNip07extenion}
                            <div class="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>No Nostr extension in your browser</span>
                                <div class="mt-2">
                                    <button class="btn btn-ghost btn-xs font-regular">
                                        Need help?
                                    </button>
                                </div>
                            </div>
                        {/if}
                        <div
                            class:opacity-20={noNip07extenion || mode==='nsecbunker'}
                            class="sm:flex sm:items-center sm:justify-between transition duration-300">
                            <div>
                                <div class="mt-2 max-w-xl text-sm">
                                    <p>Use a browser extension, like getAlby or nos2x, to login.</p>
                                </div>
                            </div>
                            <div class="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                                <button
                                    on:click={loginNip07}
                                    class="w-full lg:w-fit btn btn-outline"
                                    disabled={noNip07extenion}
                                >Browser Extension login</button>
                            </div>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="flex flex-col gap-4">
                        <div class="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h3 class="text-xl font-semibold">nsecBunker</h3>
                                <div class="mt-2 max-w-xl text-sm">
                                    <p>Use an nsecBunker to login remotely.</p>
                                </div>
                            </div>
                            <div class="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                                <button
                                    on:click={() => { mode = 'nsecbunker'; }}
                                    class="w-full lg:w-fit btn btn-outline"
                                >nsecBunker Login</button>
                            </div>
                        </div>

                        {#if mode === 'nsecbunker'}
                            <div class="flex flex-col gap-2">
                                {#if nip46ConnectionInfo}
                                    <div class="alert flex flex-col items-start gap-2">
                                        {#if nip46ConnectionInfo === 'long-time'}
                                            <p class="text-base">This request is taking longer than it should.</p>

                                            <ul class="list-disc list-inside">
                                                <li>Is your nsecBunker running?</li>
                                                <li>is your nsecBunker asking for permission to allow this connection?</li>
                                            </ul>
                                        {:else}
                                            {nip46ConnectionInfo}
                                        {/if}
                                    </div>
                                {:else}
                                    <div class="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Enter your npub or a connection string as provided by your nsecBunker.
                                    </div>
                                {/if}

                                <Textarea
                                    bind:value={nip46ConnectionString}
                                    class="w-full font-mono text-sm rounded-b-none"
                                    placeholder={"Enter connection string"}
                                />

                                <button class="btn btn-primary" on:click={loginNip46}>
                                    {#if nip46ConnectionStatus}
                                        <span class="loading loading-dots"></span>
                                    {:else}
                                        Login
                                    {/if}
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</ModalWrapper>

