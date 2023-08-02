<script lang="ts">
    import Navbar from '$lib/components/Navbar/Navbar.svelte';

    export let forceHideSidebar = false;
</script>

<div class="flex min-h-full flex-col">
    <Navbar isHiddenSidebar={forceHideSidebar} />

    <div class="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside class="sticky top-8 hidden w-44 shrink-0 lg:block">
            <slot name="sidebar" />
        </aside>

        <main class="flex-1">
            <slot />
        </main>

        <aside class="sticky top-8 hidden w-96 shrink-0 xl:block">
            <slot name="right-sidebar" />
        </aside>
    </div>
</div>
