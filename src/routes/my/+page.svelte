<script lang="ts">
    import GlobalIcon from '$lib/icons/Global.svelte';
</script>

<div class="max-w-prose text-lg flex flex-col gap-4 ">
    <div class="w-196 pb-4">
    <div class="text-4xl font-semibold flex flex-row gap-2 items-center flex-wrap md:flex-nowrap justify-between md:justify-start">
        <div>Welcome to</div>
        <div class="title-span">HIGHLIGHTER</div>
    </div>
</div>
    <div class="overflow-hidden rounded-lg bg-white shadow p-6 flex flex-col gap-6">
        <p>
            myHighlighter is an <em>experiment</em> of what a
            personal/team knowledge management system looks like
            when leveraging the global content addressability Nostr
            provides.
        </p>

        <p>
            The fact that myHighlighter is <b class="text-orange-500">alpha</b> software can't be overstated;
            don't expect a fully functional product yet.
        </p>

        <div class="text-2xl font-semibold">Some things you can do with it</div>

        <p>
            Organize your highlights that you have marked from highlighter.com
        </p>

        <p>
            Create (nested!) lists of things that are important to you.
        </p>

        <p>
            Organize your lists by drag and dropping them
        </p>
    </div>
</div>

<style>
    @media only screen and (max-width: 770px){
    .title-span {
position: relative;
        right: 0px ;
        margin-left: 80px;
    }
}
</style>