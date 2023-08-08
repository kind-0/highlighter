<script lang="ts">
    import { page } from "$app/stores";
    import JobRequestTranscription from "$lib/components/jobs/request/JobRequestTranscription.svelte";
    import JobRequestEventsFeed from "$lib/components/jobs/request/event-feed/JobRequestEventsFeed.svelte";
    import Stars from "$lib/icons/Stars.svelte";
    import ndk from "$lib/stores/ndk";
    import { NDKEvent, NDKTranscriptionDVM } from "@nostr-dev-kit/ndk";

    let jobReqId: string;
    let prevJobReqId: string | undefined = undefined;

    $: jobReqId = $page.params.jobReqId;

    $: if (jobReqId !== prevJobReqId) {
        prevJobReqId = jobReqId;

        reqJobPromise = new Promise((resolve, reject) => {
            console.log({jobReqId})
            $ndk.fetchEvent(jobReqId).then((event) => {
                if (event) {
                    transcriptionJob = NDKTranscriptionDVM.from(event);
                    resolve(transcriptionJob);
                } else { reject() };
            }).catch(reject);
        });
    }

    let transcriptionJob: NDKTranscriptionDVM;
    let reqJobPromise: Promise<NDKEvent>;
</script>

{#await reqJobPromise then}
    {#if transcriptionJob.title}
        <div class="card card-body">
            <div class="flex flex-row gap-4 w-full">
                {#if transcriptionJob.image}
                    <img src={transcriptionJob.image} class="w-20 h-20 rounded-xl object-cover" />
                {:else}
                    <span class="star-icon">
                        <Stars class="w-20 h-20 border-2 border-accent2 p-4 rounded-xl" />
                    </span>
                {/if}

                <div class="flex flex-col gap-2">
                    <h5 class="card-title text-base-100-content">
                    </h5>

                    {#if transcriptionJob.title}
                        <h1 class="lg:text-lg mb-2">
                            <span class="text-accent2">{transcriptionJob.title}</span>
                        </h1>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <JobRequestEventsFeed jobRequest={transcriptionJob} />
{/await}
