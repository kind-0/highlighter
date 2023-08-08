<script lang="ts">
    import { NDKEvent, NDKKind, NDKTranscriptionDVM, NDKDVMRequest } from '@nostr-dev-kit/ndk';
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import JobRequestEventsFeed from '$lib/components/jobs/request/event-feed/JobRequestEventsFeed.svelte';
    import JobRequestTranscription from '$lib/components/jobs/request/JobRequestTranscription.svelte';
    import { searchQuery, processingInstructions } from '$lib/stores/search';

    let prevSearchQuery: string | undefined = undefined;
    let jobRequestId: string | undefined;

    let priorJobRequests: NDKEventStore<NDKTranscriptionDVM>;
    let jobRequest: NDKTranscriptionDVM | undefined = undefined;
    let jobEvents: NDKEventStore<NDKEvent> | null = null;
    let showPriorJobResults = true;

    $: if ($searchQuery && $searchQuery !== prevSearchQuery) {
        prevSearchQuery = $searchQuery;

        if ($processingInstructions?.dvm && $processingInstructions.url) {
            priorJobRequests = $ndk.storeSubscribe({
                kinds: [NDKKind.DVMJobRequestTranscription as number],
                '#i': [$processingInstructions.url],
            }, { closeOnEose: true, groupable: false }, NDKDVMRequest)
        }
    }

    function onJobRequested() {
        showPriorJobResults = false;
        jobRequestId = jobRequest?.id;
    }

    function jobRequestCanceled() {
        jobEvents = null;
        jobRequestId = undefined;
    }
</script>

<div class="flex flex-col items-center gap-6">
    {#if $processingInstructions?.url}
        <div class="flex flex-col gap-4 w-main">
            <div class="card card-body">
                <JobRequestTranscription
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