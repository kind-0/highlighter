<script lang="ts">
    import { NDKJobRequest } from "$lib/ndk-kinds/jobs/NDKJobRequest";
    import { currentUser } from "$lib/store";
    import ndk, { type NDKEventStore } from "$lib/stores/ndk";
    import type { NDKFilter } from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import SidebarJobRequestItem from "./SidebarJobRequestItem.svelte";

    let previousJobs: NDKEventStore<NDKJobRequest>;

    onMount(() => {
        const query: NDKFilter = { kinds: [68001 as number] };

        if ($currentUser) {
            query.authors = [$currentUser.hexpubkey()];
        }

        previousJobs = $ndk.storeSubscribe(
            query,
            { closeOnEose: false },
            NDKJobRequest
        );
    });
</script>

{#if $previousJobs?.length > 0}
    <li class="menu-title">PREVIOUS JOBS</li>

    {#each $previousJobs as jobRequest}
        <SidebarJobRequestItem {jobRequest} />
    {/each}
{/if}
