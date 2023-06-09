<script lang="ts">
    import { openModal } from 'svelte-modals'
    import { Tooltip } from 'flowbite-svelte';

    import HighlightIcon from '$lib/icons/Highlight.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';

    export let event: NDKEvent;
</script>

<a
    href="/a/{event.encode()}"
    class="text-slate-500 hover:text-purple-700 w-4 h-4"
><HighlightIcon /></a>
<Tooltip color="black">Highlight</Tooltip>