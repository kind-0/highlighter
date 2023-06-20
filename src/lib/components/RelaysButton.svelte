<script lang="ts">
    import { Popover, Button } from 'flowbite-svelte'
    import { blur, fade, slide } from 'svelte/transition';
    import RelaysIcon from '$lib/icons/Relays.svelte';

    import ViewIcon from '$lib/icons/View.svelte';

    import {RelayList} from '@nostr-dev-kit/ndk-svelte-components';
    import RelaySetList from './RelaySetList.svelte';
    import ndk from '$lib/stores/ndk';

    export let iconOnly = false;

    let open = false;
    function toggle() {
        open = !open;
    }

    let sizeIndex = 0;
    const sizes = ['w-md', 'w-xl', 'w-3xl' ];

    function chanceSize() {
        sizeIndex = (sizeIndex + 1) % sizes.length;
    }
</script>

<button class="flex flex-row items-center gap-2 text-sm" on:click|stopPropagation={toggle}>
    <RelaysIcon klass="w-6 h-6" />
    {!iconOnly ? 'Relays' : ''}
</button>
<Popover {open} class="{sizes[sizeIndex]} text-base font-light z-50 overflow-hidden max-h-screen shadow-lg " transition={blur} placement='bottom' trigger="click" params={{duration: 500}}>
    <div class="flex flex-col gap-4">
        <button on:click={chanceSize}>
            <ViewIcon />
        </button>
        <hr>
        <RelaySetList ndk={$ndk} />
        <RelayList ndk={$ndk} />

    </div>
</Popover>

