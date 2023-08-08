<script lang="ts">
    import { NDKDVMRequest, type NDKDVMJobResult, type NDKTag } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/stores/ndk";

    export let jobResult: NDKDVMJobResult

    let jobRequest: NDKDVMRequest;
    let url: string | undefined = undefined;
    let title: string | undefined = undefined;
    let image: string | undefined = undefined;
    let range: NDKTag | undefined = undefined;

    try {
        const tag = jobResult.tagValue('request');

        if (tag) {
            jobRequest = new NDKDVMRequest($ndk, JSON.parse(tag));

            url = jobRequest.tagValue('i');
            title = jobRequest.tagValue('title');
            image = jobRequest.tagValue('image');
            range = jobRequest.getMatchingTags('range')[0];
        }
    } catch (e) {}
</script>

{#if jobRequest}
<div class="flex flex-row gap-2">
    {#if image}
        <img src={image} class="w-28 h-28 rounded-lg object-cover" />
    {/if}

    {#if title}
        <div class="flex flex-col">
            <span class="font-bold text-accent2">{title}</span>

            <div class="alert flex flex-row bg-base-300 flex-start justify-between">
                <div class="flex flw-row gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg>

                    <div class="flex flex-col gap-4">
                        This is an AI transcription
                    </div>
                </div>

                <div class="self-end">
                </div>
            </div>
        </div>
    {/if}
</div>
{/if}