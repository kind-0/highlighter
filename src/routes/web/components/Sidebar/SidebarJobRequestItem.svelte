<script lang="ts">
    import type { NDKJobRequest } from "$lib/ndk-kinds/jobs/NDKJobRequest";
    import { NDKJobResult } from "$lib/ndk-kinds/jobs/NDKJobResult";
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import { onDestroy, onMount } from "svelte";

    export let jobRequest: NDKJobRequest;

    let jobResults: NDKEventStore<NDKJobResult>;

    onMount(() => {
        jobResults = $ndk.storeSubscribe(
            {
                kinds: [68003 as number],
                "#e": [jobRequest.id]
            },
            { closeOnEose: false, groupable: true, groupableDelay: 2500 },
            NDKJobResult
        );
    });

    onDestroy(() => {
        if (jobResults) jobResults.unsubscribe();
    })
</script>

<li>
    <a href="#">
        {jobRequest.kind}
        <span class="badge badge-neutral badge-xs">
            <!-- {$jobResults.length} -->
        </span>
    </a>
</li>

<style>
    a {
        @apply flex flex-row items-center justify-between;
    }
</style>