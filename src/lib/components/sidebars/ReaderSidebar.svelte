<script>
    import ReaderIcon from '$icons/ReaderIcon.svelte';
    import CardWithTitle from '$components/cards/CardWithTitle.svelte';
    import Highlight from '$icons/Highlight.svelte';
    import SectionLink from '$components/Sidebar/SectionLink.svelte';
</script>

<div class="flex flex-col gap-8">
    <SectionLink
        href="/highlights"
        title="Highlighter"
    >
        <span slot="icon"><Highlight class="w-5 h-5 text-accent" /></span>
    </SectionLink>

    <CardWithTitle
        icon={ReaderIcon}
        title="Reader"
    >

        <ul class="menu bg-base-200 w-full rounded-box">
        </ul>
    </CardWithTitle>
</div>