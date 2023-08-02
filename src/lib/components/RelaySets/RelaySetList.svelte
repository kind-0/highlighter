<script lang="ts">
    import NDKRelayList from "$lib/ndk-kinds/lists/relay-list";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import type NDK from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import { changeRelaySet, reset } from ".";

    export let ndk: NDK;

    let relaySets: NDKRelayList[] = [];
    const explicitRelaySet = !!localStorage.getItem('relays');

    onMount(async () => {
        const user = await ndk.signer?.user();

        if (!user) { return; }

        const events = await ndk.fetchEvents({ kinds: [30022 as number], authors: [user.hexpubkey()] });
        relaySets = Array.from(events).map((event: NDKEvent) => new NDKRelayList(ndk, event.rawEvent()));
    });
</script>

{#if relaySets.length > 0 || explicitRelaySet}
    <div class="flex flex-col gap-2">
        <div class="font-bold">Relay Sets</div>

        {#each relaySets as relaySet}
            <button class="
                text-left
            " on:click={() => changeRelaySet(relaySet) }>
                {relaySet.name}
            </button>
        {/each}

        {#if explicitRelaySet}
            <button class="text-left py-1 bg-zinc-200 px-2 rounded-lg" on:click={reset}>
                Reset to default
            </button>
        {/if}
    </div>
{/if}