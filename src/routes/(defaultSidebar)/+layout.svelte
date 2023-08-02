<script lang="ts">
    import WithLeftSidebar from '$lib/layouts/WithLeftSidebar.svelte';
</script>

<WithLeftSidebar
    containerClass="max-w-7xl"
    forceHideSidebar={true}
>
    <div slot="sidebar">
    </div>

    <slot />
</WithLeftSidebar>
