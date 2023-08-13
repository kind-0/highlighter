<script lang="ts">
    import MainWithRightSidebar from "$lib/layouts/MainWithRightSidebar.svelte";
    import WithLeftSidebar from "$lib/layouts/WithLeftSidebar.svelte";
    import Sidebar from '$components/sidebars/ReaderSidebar.svelte'
    import TopicSelectionPrompt from "$components/TopicSelectionPrompt/TopicSelectionPrompt.svelte";
</script>

<WithLeftSidebar containerClass="max-w-7xl">
    <div slot="sidebar">
        <Sidebar />
    </div>

    <MainWithRightSidebar>
        <TopicSelectionPrompt />

        <slot />
    </MainWithRightSidebar>
</WithLeftSidebar>