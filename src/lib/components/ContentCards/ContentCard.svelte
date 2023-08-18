<script lang="ts">
    import ZapCounterIcon from "$icons/ZapCounter.svelte";

    export let title: string | undefined;
    export let summary: string | undefined;
    export let image: string | undefined;
    export let zapAmount: string = "1K";

    let aspectRatio: number;

    // See how the options work here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
    }

    export const lazyLoad = (image, src) => {
        const loaded = () => {
            aspectRatio = image.naturalWidth/image.naturalHeight;
        }
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                image.src = src                                     // replace placeholder src with the image src on observe
                if (image.complete) {                               // check if instantly loaded
                    loaded()        
                } else {
                    image.addEventListener('load', loaded)          // if the image isn't loaded yet, add an event listener
                }
            }
        }, options)
        observer.observe(image)                                     // intersection observer
        return {
            destroy() {
                image.removeEventListener('load', loaded)           // clean up the event listener
            }
        }
    }

</script>

<div class="flex flex-col gap-4">
    <div class="relative group overflow-hidden flex flex-col justify-end w-[174px] h-[244px] shadow rounded-3xl">
        <div class="absolute top-0 left-0 h-full w-full z-0">
        {#if image}
            <img id="bg-image" use:lazyLoad={image} class="object-cover {aspectRatio <= 1 ? 'w-full': 'h-full'} rounded-3xl"/>
        {:else}
            <div class="h-full w-full grad-blue rounded-3xl"></div>
        {/if}
        </div>
        <div class="absolute top-4 left-4 w-7 h-7 rounded">
            <slot name="icon" />
        </div>
        <div class="w-full mx-0 h-[90px] blur-element group-hover:h-full flex flex-col p-4 bg-base-300 bg-opacity-70 backdrop-blur-[22px] transition-all duration-300 rounded-b-3xl group-hover:rounded-3xl z-20">
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

    .grad-blue { background-image: radial-gradient(farthest-corner at 100% 0px, #5CA2FF 0%, #916EFF 100%); }

    .blur-element {
        /* box-shadow: inset 0 0 0 2px #232323;  */
        /* border: 1px solid transparent */
        /* width: calc(100% + 2px) */
        /* transform: translateZ(0) */
    }
</style>