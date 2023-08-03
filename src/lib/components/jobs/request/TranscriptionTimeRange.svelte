<script lang="ts">
    import { onMount } from 'svelte';
    import type { ProcessableTypes } from './types';

    export let type: ProcessableTypes;
    export let url: string;

    export let startTime: number = 0;
    export let endTime: number;

    onMount(() => {
        switch (type) {
            case 'overcast':
                let time = extractTimeFromUrl(url);
                if (time !== null) {
                    startTime = time;
                    endTime = time + 60;
                }
                break;
        }
    });

    function extractTimeFromUrl(url: string): number | null {
        const timeParam = '#t=';
        const timeIndex = url.indexOf(timeParam);

        if (timeIndex !== -1) {
            const timeValue = url.substring(timeIndex + timeParam.length);
            const parsedTime = parseInt(timeValue, 10);

            if (!isNaN(parsedTime)) {
                return parsedTime;
            }
        }

        return null
    }
</script>

<div class="flex flex-row gap-4 my-4 items-center">
    From
    <input type="text" class="input input-bordered w-24" placeholder="Start time" bind:value={startTime} />
    to
    <input type="text" class="input input-bordered w-24" placeholder="Start time" bind:value={endTime} />
</div>