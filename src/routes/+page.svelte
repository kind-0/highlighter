<script lang="ts">
    import Navbar from '$lib/components/Navbar/Navbar.svelte';
    import ButtonWithBorderGradient2 from '$lib/components/buttons/ButtonWithBorderGradient2.svelte';
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
</script>

<svelte:head>
    <title>Highlighter</title>
    <meta name="description" content="Highlighter" />
</svelte:head>

<div class="flex flex-col h-screen overflow-x-hidden">
    <Navbar isHiddenDrawerBtn={true} isHiddenRelayBtn={true} />
    <div class="hero flex flex-column justify-center">
        <div class="w-full md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-5 md:gap-12">
            <div class="relative">
                <div class="mx-10 blur-sm text-xs md:text-base font-normal pb-1 hidden sm:block">
                    <span
                        >Here’s the thing that nostr got right, and it’s the same thing that Bitcoin got right: information is easy to spread and hard
                        to stifle.</span
                    ><span style="underline">1</span><span>
                        Information can be copied quickly and perfectly, which is, I believe, the underlying reason for its desire to be free.<br
                        /><br />Easy to spread, hard to stifle. That’s the base reality of the nature of information. As always, the smart thing is to
                        work with nature, not against it.</span
                    ><span style="underline">2</span><span>
                        That’s what’s beautiful about the orange coin and the purple ostrich: both manage to work with the peculiarities of
                        information, not against them. Both realize that information can and should be copied, as it can be perfectly read and easily
                        spread, always. Both understand that resistance to censorship comes from writing to many places, making the cost of deletion
                        prohibitive.</span
                    >
                </div>
                <div class="mx-10 blur-sm text-xs md:text-base font-normal pb-1 sm:hidden">
                    <span
                        >Here’s the thing that nostr got right, and it’s the same thing that Bitcoin got right: information is easy to spread and hard
                        to stifle.</span
                    ><span style="underline">1</span><span>
                        Information can be copied quickly and perfectly, which is, I believe, the underlying reason for its desire to be free.<br
                        /><br />Easy to spread, hard to stifle. That’s the base reality of the nature of information. As always, the smart thing is to
                        work with nature, not against it.</span
                    >
                </div>
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-base-100" />
                <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-white text-4xl md:text-6xl z-1 text-center font-bold w-full"
                >
                    <!-- TODO UPDATE GRADIENT COLOR FOR LIGHT AND DARK MODE -->
                    <span class="bg-clip-text text-transparent bg-gradient-to-tr from-gradient4 to-gradient3">
                        Make the most of <br />what you read
                    </span>
                </div>
            </div>

            <div class="px-10">
                <GenericEventCard
                    id="532808e4d60f5f82b95aeaa3ed2e930a0c5973dccb0ede68b28b1931db91440f"
                    skipTitle={false}
                    skipReplies={true}
                    skipFooter={true}
                    expandReplies={false}
                />
            </div>

            <div class="relative">
                <div class="mx-10 blur-sm text-xs md:text-base font-normal pb-1">
                    <span class="hidden sm: block"
                        >Here’s the thing that nostr got right, and it’s the same thing that Bitcoin got right: information is easy to spread and hard
                        to stifle.</span
                    >
                    <span style="underline hidden sm:block">1</span><span class="hidden sm:block">
                        Information can be copied quickly and perfectly, which is, I believe, the underlying reason for its desire to be free.<br
                        /><br />Easy to spread, hard to stifle. That’s the base reality of the nature of information. As always, the smart thing is to
                        work with nature, not against it.</span
                    ><span style="underline">2</span><span>
                        That’s what’s beautiful about the orange coin and the purple ostrich: both manage to work with the peculiarities of
                        information, not against them. Both realize that information can and should be copied, as it can be perfectly read and easily
                        spread, always. Both understand that resistance to censorship comes from writing to many places, making the cost of deletion
                        prohibitive.</span
                    >
                </div>
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-base-100" />

                <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 text-white text-4xl md:text-6xl z-1 text-center font-bold w-full"
                >
                    <span class="bg-clip-text text-transparent bg-gradient-to-tr from-gradient4 to-gradient3">
                        Highlight Anything, <br />Anywhere</span
                    >
                </div>

                <ButtonWithBorderGradient2
                    class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/3 md:translate-y-1/4 lg:translate-y-3/4"
                    innerClass="text-xl md:text-2xl px-10 py-4"
                    style="z-index: 9999"
                    href="/highlights/global/newest"
                >
                    Get Started
                </ButtonWithBorderGradient2>
            </div>
        </div>
    </div>
</div>
