<script lang="ts">
    import ZapCounterIcon from "$icons/ZapCounter.svelte";

    export let title: string | undefined = "Nostr long form article";
    export let summary: string | undefined;
    export let image: string | undefined;
    export let zapAmount: string = "1K";

    let aspectRatio: number;

    export const lazyLoad = (image, src) => {
        const loaded = () => {
            aspectRatio = image.naturalWidth/image.naturalHeight;
        }
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 0
        }
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                image.src = src
                // check if instantly loaded
                if (image.complete) {  
                    loaded()        
                } else {
                    // if the image isn't loaded yet, add an event listener
                    image.addEventListener('load', loaded)
                }
            }
        }, options)
        // intersection observer
        observer.observe(image)  
        return {
            destroy() {
                // clean up the event listener
                image.removeEventListener('load', loaded)           
            }
        }
    }

</script>

<div class="flex flex-col gap-4">
    <div class="relative group overflow-hidden flex flex-col justify-end w-[174px] h-[244px] shadow rounded-xl">
        <div class="absolute top-0 left-0 h-full w-full">
        {#if image}
            <img id="bg-image" use:lazyLoad={image} class="object-cover {aspectRatio <= 1 ? 'w-full': 'h-full'} rounded-xl"/>
        {:else}
            <div class="h-full w-full grad-blue rounded-xl"></div>
        {/if}
        </div>

        <div class="absolute top-4 left-4 w-7 h-7 rounded  bg-base-300  overflow-hidden">
            <slot name="icon"/>
        </div>

        <div class="w-full mx-0 h-[90px] group-hover:h-full flex flex-col p-4 bg-base-300 bg-opacity-70 backdrop-blur-[22px] transition-all duration-300 rounded-b-xl group-hover:rounded-xl">
            <div class="max-h-14">
                <p class="title text-base-100-content text-xs font-medium leading-[18px]">{title}</p>
            </div>
            <div class="hidden group-hover:flex flex-col flex-grow justify-between pt-2 gap-2.5 transition-all duration-300">
                <div>
                    {#if summary}
                    <p class="summary text-xs font-normal leading-[18px]">{summary}</p>
                    {/if}
                </div>
                <div class="h-7 w-fit flex items-center px-3 gap-2 bg-base-200  rounded-full">
                    <span class="text-right text-xs font-normal">{zapAmount}</span>
                    <ZapCounterIcon />
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <slot name="footer" />
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