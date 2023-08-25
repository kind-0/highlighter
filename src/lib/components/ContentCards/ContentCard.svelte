<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import ZapCounter from "./ZapCounter.svelte";

    export let title: string | undefined;
    export let summary: string | undefined;
    export let image: string | undefined;
    export let url: string = "#";
    export let event: NDKEvent;

    let aspectRatio: number;
    let imgLoaded: boolean = false;

    export const lazyLoad = (image, src) => {
        const loaded = () => {
            aspectRatio = image.naturalWidth/image.naturalHeight;
            imgLoaded = true;
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
        }, {})
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

<a href={url} class="flex flex-col gap-4 w-[174px]">
    <div class="relative group overflow-hidden flex flex-col justify-end h-[244px] w-full shadow rounded-xl">
        <div class="absolute top-0 left-0 h-full w-full rounded-xl {!imgLoaded ? 'grad-blue' : ''}">
        {#if image}
            <img use:lazyLoad={image} class="object-cover rounded-xl {aspectRatio <= 1 ? 'w-full': 'h-full'}"/>
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
                <ZapCounter {event} />
            </div>
        </div>
    </div>

    <div class="flex w-full px-2 justify-center items-center">
        <slot name="footer" />
    </div>
</a>

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