<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import LoginNip07Button from './LoginNip07Button.svelte';
    import LoginGuestButton from './LoginGuestButton.svelte';
    import LoginNip46Button from './LoginNip46Button.svelte';
</script>

{#if !$ndk.signer}
    <!-- TODO on:focus btn change to X btn-circle -->
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-rounded-full p-1 rounded-full border border-accent2 bg-base-200 hover:bg-accent2  text-base-100-content hover:text-base-200 transition">
            <span
                class="block flex items-center px-4 md:px-9 h-full font-semibold uppercase text-sm md:text-base whitespace-nowrap normal-case"
                >Log In</span
            >
        </label>
        <ul tabindex="0" class="mt-5 dropdown-content z-[1] divide-y divide-neutral-800 menu p-0 shadow rounded-box w-80">
            <li>
                <div class="flex justify-center menu-title">
                    <div class="p-1 text-center text-base font-medium">Log In</div>
                </div>
            </li>
            <div class="p-4">
                <div class="flex flex-col items-start px-4">
                    <div class="text-sm text-base">
                        Highlighter is a tool built using the <span class="text-accent2">Nostr Protocol</span>, which means you can login using keys
                        instead of a centralized identity provider.
                    </div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-center">
                    <div class="flex flex-col gap-2 w-full">
                        <div class="text-center text-xs font-normal">New to all this?</div>
                        <LoginGuestButton />
                    </div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-center">
                    <div class="flex flex-col gap-2 w-full">
                        <div class="text-center text-xs font-normal">Already on Nostr?</div>
                        <LoginNip07Button />
                        <LoginNip46Button />
                    </div>
                </div>
            </div>
        </ul>
    </div>
{/if}
