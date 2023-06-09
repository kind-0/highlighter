<script lang="ts">
	import type { NDKEvent } from '@nostr-dev-kit/ndk';

    import BoostIcon from '$lib/icons/Boost.svelte';
    import { Tooltip } from 'flowbite-svelte';

    import { openModal } from 'svelte-modals'
    import BoostModal from '$lib/modals/Boost.svelte';

    export let event: NDKEvent;
</script>

<button class="
    text-slate-500 hover:text-orange-500
    flex flex-row items-center gap-2 w-4 h-4
" on:click={() => { openModal(BoostModal, { id: event.encode(), event }) }}>
    <BoostIcon />
</button>
<Tooltip  color="black">Boost</Tooltip>
