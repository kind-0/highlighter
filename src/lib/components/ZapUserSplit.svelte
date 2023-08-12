<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';

    export let pubkey: string | undefined = undefined;
    export let split: number = 60;

</script>

<div class="flex flex-row gap-2 justify-between items-center">
    <div class="flex flex-row justiry-start items-center w-1/2 gap-3">
        <Avatar {pubkey} class="w-12 h-12" />
        <div class="w-0 flex flex-col flex-grow">
            <span class="truncate whitespace-nowrap">
                <Name {pubkey} class="text-base-100-content font-normal text-xs leading-[18px] capitalize"/>
            </span>
            <span class="text-xs font-normal">{split}%</span>
        </div>
    </div>
    <div class="w-1/2">
        <input bind:value={split} type="range" min="0" max="100" class="range range-accent range-xs" />
    </div>

</div>
