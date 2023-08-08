<script lang="ts">
    import Sidebar from "../web/components/Sidebar/Sidebar.svelte";
    import WithLeftSidebar from "$lib/layouts/WithLeftSidebar.svelte";
</script>

<WithLeftSidebar
    containerClass="max-w-7xl"
    insideContainerClass=""
>
    <div class="flex-1" slot="sidebar">
        <Sidebar />
    </div>

    <slot />
</WithLeftSidebar>