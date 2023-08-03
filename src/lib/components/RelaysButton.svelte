<script lang="ts">
    import {RelayList} from '@nostr-dev-kit/ndk-svelte-components';
    import ndk from '$lib/stores/ndk';
    import { PlugsConnected } from 'phosphor-svelte';

    export let iconOnly = false;

    let open = false;
    function toggle() {
        open = !open;
    }
</script>

<div class="dropdown dropdown-end">
    {#if iconOnly}
        <div class="tooltip tooltip-bottom" data-tip="Connected Relays">
            <label tabindex="0" class="btn btn-circle">
                <PlugsConnected class="w-6 h-6" />
            </label>
        </div>
    {:else}
        <label tabindex="0">
            <button class="flex flex-row items-center gap-2 text-sm" on:click|stopPropagation={toggle}>
                <PlugsConnected />
                Relays
            </button>
        </label>
    {/if}

    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div tabindex="0" class="dropdown-content z-20 card card-compact w-96 shadow bg-primary text-primary-content">
        <div class="card-body">
            <div class="flex flex-col gap-4">
                <RelayList ndk={$ndk} />
            </div>
        </div>
    </div>
</div>

