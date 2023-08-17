<script lang="ts">
    import MicIcon from "$icons/MicIcon.svelte";
    import ZapCounterIcon from "$icons/ZapCounter.svelte";

    export let title: string = "Episode 21: Overlap of Nostr, Bitcoin and Christianity Episode 21: Overlap of Nostr, Bitcoin and Christianity";
    export let summary: string = "This has to be able to hold a full content description but we shouldn’t exagerate This has to be able to hold a full content description but we shouldn’t exagerate. This has to be able to hold a full content description but we shouldn’t exagerate";
    export let zapAmount: string = "1K";
    export let image: string = "/images/background.png"
</script>


<div class="relative group flex flex-col justify-end w-[174px] h-[244px] shadow mb-10 rounded-[22px] overflow-hidden">
    <img class="absolute object-cover rounded-[22px] h-full" src={image}/>
    <div class="absolute top-4 left-4 w-7 h-7 rounded">

        <MicIcon class="w-7 h-7 bg-base-300 text-zinc-400 rounded-lg" />
    </div>
    <div class="w-full h-[90px] group-hover:h-full flex flex-col p-4 bg-neutral-900 bg-opacity-70 rounded-b-[22px] group-hover:rounded-[22px] backdrop-blur-[22px] transition-all duration-300">
        <div class="max-h-14">
            <p class="title text-base-100-content text-xs font-medium leading-[18px]">{title}</p>
        </div>
        <div class="hidden group-hover:flex flex-col flex-grow justify-between pt-2 gap-2.5 z-0  transition-all duration-300">
            <div class="">
                <p class="summary text-zinc-400 text-xs font-normal leading-[18px]">{summary}</p>
            </div>
            <div class="h-7 w-fit flex items-center px-3 gap-2 bg-neutral-800 rounded-full">
                <span class="text-right text-zinc-400 text-xs font-normal">{zapAmount}</span>
                <ZapCounterIcon />
            </div>
        </div>
    </div>
</div>

<style>
    .title {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    .summary {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 6;
        overflow: hidden;
    }
</style>