<script lang="ts">
    import Sidebar from "$components/sidebars/HighlightsSidebar.svelte";
    import WithLeftSidebar from "$lib/layouts/WithLeftSidebar.svelte";
</script>

<WithLeftSidebar containerClass="max-w-7xl">
    <div slot="sidebar">
        <Sidebar isHiddenSidebar={false} />
    </div>

    <slot />
</WithLeftSidebar>
