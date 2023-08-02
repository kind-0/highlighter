<script lang="ts">
    import PageTitle from '$lib/components/PageTitle.svelte';
    import ButtonWithBorderGradient2 from '$lib/components/buttons/ButtonWithBorderGradient2.svelte';
    import Stars from '$lib/icons/Stars.svelte';

    let bid = 50;
</script>

<PageTitle
    title="Explore"
    subtitle="Explore the most interesting highlights that are relevant to you"
/>

<div class="card w-fit relative">
    <div class="absolute top-0 left-0 w-full h-full bg-base-100/80 z-50 flex flex-row items-center justify-center brightness-200 text-lg">
        Coming soon
    </div>
    <div class="card-body flex flex-col gap-8">
        <div class="flex flex-row gap-6">
            <div>
                <span class="star-icon">
                    <Stars class="w-20 h-20 border-2 border-accent2 p-4 rounded-xl" />
                </span>
            </div>

            <div class="flex flex-col gap-2 brightness-200">
                <h5 class="card-title">
                    Generate AI feed
                </h5>
                <p class="mb-3">
                    Generate a feed of highlights that are relevant to you with
                    <br>
                    a market of competing algorithms
                </p>
            </div>
        </div>

        <div class="flex flex-row gap-4 w-full">
            <div class="flex-grow">
                <p class="mb-4 text-sm">How much you are willing to pay for this feed</p>
                <input bind:value={bid} type="range" min="1" max="100" class="range range-neutral range-sm" />
                <p>{bid} sats</p>
            </div>

            <div class="flex flex-row gap-2 self-end">
                <ButtonWithBorderGradient2 disabled={true}>
                    Request
                </ButtonWithBorderGradient2>
            </div>
        </div>
    </div>
</div>

<style>
    .star-icon {
        border-radius: 1.375rem;
        background: #000;
        box-shadow: 0px 0px 21px 2px rgba(142, 113, 255, 0.50);
    }
</style>