<script lang="ts">
    import {Name} from '@nostr-dev-kit/ndk-svelte-components';

    import ChevronDownIcon from '$lib/icons/ChevronDown.svelte';
    import { currentUser } from '$lib/store';
    import _ndk from '$lib/stores/ndk';

    import type { NDKUser } from '@nostr-dev-kit/ndk';
    import type NDK from '@nostr-dev-kit/ndk';

    export let delegatedName: string | undefined = undefined;
    export let delegatedUser: NDKUser | undefined = undefined;
    export let value: string;

    let ndk = $_ndk as NDK;
</script>

{#if $currentUser}
    <div class="dropdown">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label tabindex="0" class="
            btn btn-neutral
            font-semibold
            flex flex-row items-center gap-2
            text-left
            truncate
            whitespace-nowrap
            {$$props.class}
        ">
            <div class="font-normal truncate">
                {#if value === 'Public'}
                    Public (as <Name {ndk} user={$currentUser} />)
                {:else if value === 'Delegated'}
                    Public (as
                    {#if delegatedName}
                        {delegatedName}
                    {:else if delegatedUser}
                        <Name ndk={ndk} user={delegatedUser} />
                    {/if})
                {:else if value === 'Secret'}
                    Secret
                {:else}
                    {value}
                {/if}
            </div>
            <div class="w-4 h-4"><ChevronDownIcon /></div>
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow rounded-box">
            <li>
                <button on:click={() => { value = "Public" }}>
                    <div class="flex flex-col pl-2.5">
                        <span class="text-base brightness-150">Public (as <Name {ndk} user={$currentUser} />)</span>
                        <div class="text-sm font-normal">Public note. Shows up in your followers' timeline.</div>
                    </div>
                </button>
            </li>

            <li>
                <button on:click={() => { value = "Delegated" }}>
                    <div class="flex flex-col pl-2.5">
                        <span class="text-base brightness-150">
                            Public (as
                            {#if delegatedName}
                                {delegatedName}
                            {:else}
                                <Name {ndk} user={delegatedUser} />
                            {/if})
                        </span>
                        <div class="text-sm font-normal">Public note. Will not show up in your followers' timeline</div>
                    </div>
                </button>
            </li>

            <li>
                <button on:click={() => { value = "Secret" }}>
                    <div class="flex flex-col pl-2.5">
                        <span class="text-base brightness-150">Secret</span>
                        <div class="text-sm font-normal">Secret, encrypted note. No one can comment on it.</div>
                    </div>
            </button>
            </li>
        </ul>
    </div>


    <style>
        :global(input[type="radio"]) {
            margin-right: 0.5rem;
        }
    </style>
{/if}
