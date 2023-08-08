<script lang="ts">
    import { currentUser } from "$lib/store";
    import ndk, { type NDKEventStore } from "$lib/stores/ndk";
    import { type NDKFilter, NDKDVMRequest } from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import SidebarJobRequestItem from "./SidebarJobRequestItem.svelte";
    import { derived, type Readable } from "svelte/store";

    let previousJobs: NDKEventStore<NDKDVMRequest>;
    let sortedJobs: Readable<NDKDVMRequest[]>;

    onMount(() => {
        const query: NDKFilter = { kinds: [65002 as number], limit: 10 };

        if ($currentUser) {
            query.authors = [$currentUser.hexpubkey()];
        }

        previousJobs = $ndk.storeSubscribe(
            query,
            { closeOnEose: false },
            NDKDVMRequest
        );

        sortedJobs = derived(previousJobs, ($previousJobsStore) =>
            $previousJobsStore.sort((a, b) => a.created_at! - b.created_at!)
        );
    });

</script>

{#if $previousJobs?.length > 0}
    <li class="menu-title">PREVIOUS JOBS</li>

    {#each $previousJobs as jobRequest}
        <SidebarJobRequestItem {jobRequest} />
    {/each}
{/if}
