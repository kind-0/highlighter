<script>
    import SidebarMode from "$lib/components/Sidebar/SidebarMode.svelte";
    import Relays from "$lib/icons/Relays.svelte";
    import SidebarPreviousJobs from "./SidebarPreviousJobs.svelte";
</script>

<div class="flex flex-col gap-8">
    <SidebarMode />

    <ul class="menu bg-base-200 w-full rounded-box">
        <li class="border-b border-base-300 -mx-2 px-2">
            <button class="flex flex-row gap-4 items-center text-lg brightness-200 rounded-b-none">
                <Relays />
                Default Relays
            </button>
        </li>

        <SidebarPreviousJobs />
    </ul>
</div>
