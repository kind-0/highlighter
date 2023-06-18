<script lang="ts">
    import {Name} from '@nostr-dev-kit/ndk-svelte-components';

    import ChevronDownIcon from '$lib/icons/ChevronDown.svelte';
    import { currentUser } from '$lib/store';
    import _ndk from '$lib/stores/ndk';

    import { Dropdown, Radio } from 'flowbite-svelte'
    import type { NDKUser } from '@nostr-dev-kit/ndk';
    import type NDK from '@nostr-dev-kit/ndk';

    export let delegatedName: string | undefined = undefined;
    export let delegatedUser: NDKUser | undefined = undefined;
    export let value: string;
    export let placement: string = 'bottom-start';

    let ndk = $_ndk as NDK;
</script>

{#if $currentUser}
    <button class="
        px-4 py-2
        border border-zinc-200
        text-sm
        bg-white
        shadow-md
        rounded-lg
        font-semibold
        flex flex-row items-center gap-2
        text-left
        {$$props.class}
    ">
        <div class="font-normal">
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
    </button>
    <Dropdown class="
        w-auto mx-2 sm:mx-0 sm:w-96 border border-zinc-200 rounded-lg shadow-md z-50 text-sm
        bg-white
    " {placement}>
        <li class="rounded hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-4 border-b border-b-zinc-200">
            <Radio bind:group={value} value='Public'>
                <div class="flex flex-col pl-2.5">
                    <span class="text-base">Public (as <Name {ndk} user={$currentUser} />)</span>
                    <div class="text-zinc-400">Public note. Shows up in your followers' timeline.</div>
                </div>
            </Radio>
        </li>
        {#if delegatedName || delegatedUser}
            <li class="rounded hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-4 border-b border-b-zinc-200">
                <Radio bind:group={value} value='Delegated'>
                    <div class="flex flex-col pl-2.5">
                        <span class="text-base">
                            Public (as
                            {#if delegatedName}
                                {delegatedName}
                            {:else}
                                <Name {ndk} user={delegatedUser} />
                            {/if})
                        </span>
                        <div class="text-zinc-400">Public note. Will not show up in your followers' timeline</div>
                    </div>
                </Radio>
            </li>
        {/if}
            <li class="rounded hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-4">
                <Radio bind:group={value} value='Secret'>
                    <div class="flex flex-col pl-2.5">
                        <span class="text-base">Secret</span>
                        <div class="text-zinc-400">Secret, encrypted note. No one can comment on it.</div>
                    </div>
                </Radio>
            </li>
    </Dropdown>

    <style>
        :global(input[type="radio"]) {
            margin-right: 0.5rem;
        }
    </style>
{/if}