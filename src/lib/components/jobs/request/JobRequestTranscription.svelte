<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { createEventDispatcher } from "svelte";
    import type { ProcessableTypes } from './types';
    import TranscriptionTimeRange from './TranscriptionTimeRange.svelte';
    import Stars from '$lib/icons/Stars.svelte';
    import ButtonWithBorderGradient2 from '$lib/components/buttons/ButtonWithBorderGradient2.svelte';
    import { NDKTranscriptionDVM } from '@nostr-dev-kit/ndk';

    const dispatch = createEventDispatcher();

    export let type: ProcessableTypes;
    export let url: string;
    export let jobRequest: NDKTranscriptionDVM | undefined = undefined;
    export let title: string | undefined = undefined;
    export let image: string | undefined = undefined;

    let startTime: number = 0;
    let endTime: number = 0;

    /**
     * Publishes the job request
     */
    async function requestService() {
        if (!url) return;

        // correct url
        url = url.replace(/#t=.*$/i, '');

        jobRequest = new NDKTranscriptionDVM($ndk);

        jobRequest.bid = processBid * 1000;
        jobRequest.addInput(url, "url");
        jobRequest.job = 'speech-to-text';

        if (startTime.toString().length > 0 && endTime.toString().length > 0) {
            jobRequest.addParam('range', startTime.toString(), endTime.toString());
        }

        jobRequest.output = 'text/plain';

        if (title) jobRequest.tags.push(['title', title]);
        if (image) jobRequest.tags.push(['image', image]);

        await jobRequest.publish();

        dispatch('jobRequested');
    }

    /**
     * Cancels the job request
     */
    async function cancelJobRequest() {
        if (!jobRequest) return;

        await jobRequest.delete("Cancelled by user");

        dispatch('cancel');
        jobRequest = undefined;
    }

    function friendly(type: string) {
        switch (type) {
            case 'overcast':
                return 'podcast';
            case 'youtube':
                return 'video';
            default:
                return type;
        }
    }

    let processBid = 1000;
</script>

        <div class="flex flex-row gap-4 w-full">
            {#if image}
                <img src={image} class="w-20 h-20 rounded-xl object-cover" />
            {:else}
                <span class="star-icon">
                    <Stars class="w-20 h-20 border-2 border-accent2 p-4 rounded-xl" />
                </span>
            {/if}

            <div class="flex flex-col gap-2">
                <h5 class="card-title text-base-100-content">
                    Transcribe {friendly(type)}?
                </h5>

                {#if title}
                    <h1 class="lg:text-lg mb-2">
                        <span class="text-accent2">{title}</span>
                    </h1>
                {/if}
            </div>
        </div>

        {#if type === 'video'}
            <video class="w-full h-64">
                <source src={url} />
            </video>
        {:else if type === 'audio'}
            <audio class="w-full h-64">
                <source src={url} />
            </audio>
        {/if}

        <TranscriptionTimeRange {type} {url} bind:startTime bind:endTime />
        <p class="mb-4">Choose how much you are willing to pay for this transcription</p>

        <div class="flex flex-row gap-4 w-full">
            <div class="flex-grow">
                <input bind:value={processBid} type="range" min="100" max="10000" class="range range-neutral range-sm" />
                <p>{processBid} sats</p>
            </div>

            <div class="flex flex-row gap-2 self-end">
            {#if !jobRequest}
                    <ButtonWithBorderGradient2 on:click={requestService} disabled={!!jobRequest}>
                        Request
                    </ButtonWithBorderGradient2>
            {:else}
                <span class="loading loading-spinner" />
                <button class="btn bg-base-300 flex flex-row gap-2 whitespace-nowrap" on:click={cancelJobRequest}>
                    Cancel
                </button>
            {/if}
            </div>
        </div>

<style>
    .star-icon {
        border-radius: 1.375rem;
        background: #000;
        box-shadow: 0px 0px 21px 2px rgba(142, 113, 255, 0.50);
    }
</style>