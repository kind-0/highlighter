<script lang="ts">
    import Navbar from '$lib/components/Navbar/Navbar.svelte';

    export let forceHideSidebar = false;
    let drawer: boolean;
</script>

<div class="min-h-full">
    <Navbar isHiddenSidebar={forceHideSidebar} />

    <div class="mx-auto md:pt-2 sm:px-2 xl:px-0 {$$props.containerClass}">
        <div class="drawer {!forceHideSidebar ? 'lg:drawer-open ' : ''}">
            <input id="left-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawer} />
            <div class="drawer-content overflow-x-auto">
                <div class="
                    flex flex-col gap-4
                    w-full lg:pl-32 lg:pr-0
                    {!forceHideSidebar ? 'lg:w-full' : ''}
                    {$$props.insideContainerClass}
                ">
                    <slot />
                </div>
            </div>

            <div id="left-sidebar" class="drawer-side fixed lg:!w-sidebar z-50 lg:z-0 {$$props.sidebarClass}">
                <label for="left-drawer" class="drawer-overlay"></label>
                <div class="
                    flex flex-col items-stretch w-full overflow-y-auto
                    h-full
                    bg-base-100/90
                    px-2 md:px-0
                    pt-8 md:pt-0
                    {$$props.sidebarContentClass}
                " on:click={()=>{ drawer = false }}>
                    <slot name="sidebar" />
                </div>
            </div>
        </div>
    </div>
</div>
