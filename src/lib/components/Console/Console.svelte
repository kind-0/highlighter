<script lang="ts">
    import { goto } from '$app/navigation';
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import { NDKJobRequest } from '$lib/ndk-kinds/jobs/NDKJobRequest';
    import JobRequestEventsFeed from '$lib/components/jobs/request/event-feed/JobRequestEventsFeed.svelte';
    import JobRequestCard from '$lib/components/jobs/request/JobRequestCard.svelte';
    import { tryToLoadBech32, tryToLoadDVM } from '../../utils/search/matchers';
    import { searchQuery, processingInstructions } from '$lib/stores/search';

    let prevSearchQuery: string | undefined = undefined;

    export let url: string | null = null;
    export let embedUrl: string | undefined = undefined;
    export let authorPubkey: string | null = null;
    let title: string | undefined = undefined;
    let image: string | undefined = undefined;
    let knowAuthorPubkey = false;
    let jobRequestId: string | undefined;
    let jobRequestUrl: string | undefined;

    let loadButtonPending = false;
    let priorJobRequests: NDKEventStore<NDKJobRequest>;
    let jobRequest: NDKJobRequest | undefined = undefined;
    let jobEvents: NDKEventStore<NDKEvent> | null = null;
    let showPriorJobResults = true;

    $: if ($searchQuery && $searchQuery !== prevSearchQuery) {
        prevSearchQuery = $searchQuery;

        if ($processingInstructions?.dvm && $processingInstructions.url) {
            priorJobRequests = $ndk.storeSubscribe({
                kinds: [68001 as number],
                '#i': [$processingInstructions.url],
            }, { closeOnEose: true, groupable: false }, NDKJobRequest)
        }
    }



    function onJobRequested() {
        showPriorJobResults = false;
        jobRequestId = jobRequest.id;
    }

    function jobRequestCanceled() {
        jobEvents = null;
        jobRequestId = undefined;
    }
</script>

<div class="flex flex-col items-center gap-6">
    {#if $processingInstructions?.url}
        <div class="flex flex-col gap-4">
            <div class="card card-body">
                <JobRequestCard
                    bind:jobRequest
                    type={$processingInstructions.type}
                    title={$processingInstructions.title}
                    image={$processingInstructions.image}
                    url={$processingInstructions.url}
                    embedUrl={$processingInstructions.embed}
                    on:jobRequested={onJobRequested}
                    on:cancel={jobRequestCanceled}
                />
            </div>
                {#if showPriorJobResults && $priorJobRequests && $priorJobRequests.length > 0}
                    <div class="flex flex-col gap-4">
                        {#each $priorJobRequests as job}
                            <JobRequestEventsFeed onlyJobsWithResults={true} jobRequest={job} />
                        {/each}
                    </div>
                {:else if jobRequestId && jobRequest}
                    <JobRequestEventsFeed {jobRequest} />
                {/if}
        </div>
    {/if}
</div>