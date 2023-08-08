<script lang="ts">
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import { onDestroy, onMount } from "svelte";
    import { NDKDVMRequest, NDKDVMJobResult, NDKKind } from "@nostr-dev-kit/ndk";

    export let jobRequest: NDKDVMRequest;

    let jobResults: NDKEventStore<NDKDVMJobResult>;

    const image = jobRequest.tagValue('image');
    const title = jobRequest.tagValue('title');

    onMount(() => {
        jobResults = $ndk.storeSubscribe(
            {
                kinds: [NDKKind.DVMJobResult as number],
                ...jobRequest.filter()
            },
            { closeOnEose: false, groupable: true, groupableDelay: 2500 },
            NDKDVMJobResult
        );
    });

    onDestroy(() => {
        if (jobResults) jobResults.unsubscribe();
    })
</script>

{#if title}

<li class="overflow-hidden w-fit">
    <a href="/dvm/{jobRequest.encode()}" class="overflow-hidden flex items-start justify-start text-left">
        {#if image}
            <img src={image} alt="image" class="w-10 h-10 object-cover rounded-circle me-2" />
        {/if}
        <span class="truncate">{title}</span>
        <span class="badge badge-neutral badge-xs">
            {$jobResults?.length}
        </span>
    </a>
</li>
{/if}

<style>
    a {
        @apply flex flex-row items-center justify-between;
    }
</style>