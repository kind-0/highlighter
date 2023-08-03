<script>
    import RelaySetButton from "$lib/components/Sidebar/RelaySetButton.svelte";
    import SidebarMode from "$lib/components/Sidebar/SidebarMode.svelte";
    import SidebarPreviousJobs from "./SidebarPreviousJobs.svelte";
</script>

<div class="flex flex-col gap-8">
    <SidebarMode />

    <ul class="menu bg-base-200 w-full rounded-box">
        <RelaySetButton />

        <SidebarPreviousJobs />
    </ul>
</div>
