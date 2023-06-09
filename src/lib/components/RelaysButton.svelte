<script lang="ts">
    import { Popover, Button } from 'flowbite-svelte'
    import { blur, fade, slide } from 'svelte/transition';
    import RelaysIcon from '$lib/icons/Relays.svelte';

    import {RelayList} from '@nostr-dev-kit/ndk-svelte-components';
    import RelaySetList from './RelaySetList.svelte';
    import ndk from '$lib/stores/ndk';

    export let iconOnly = false;
</script>

<button class="flex flex-row items-center gap-2 text-sm">
    <RelaysIcon klass="w-6 h-6" />
    {!iconOnly ? 'Relays' : ''}
</button>
<Popover class="w-96 text-sm font-light z-50 overflow-auto max-h-screen shadow-lg" transition={blur} placement='bottom' params={{duration: 500}}>
    <div class="flex flex-col gap-4">
        <RelaySetList ndk={$ndk} />
        <RelayList ndk={$ndk} />
    </div>
</Popover>

