<script lang="ts">
    import { rightDrawerContent } from '$lib/stores/right-drawer';
    import ThreadView from '$lib/components/ThreadView/ThreadView.svelte';
</script>

<div
    class="drawer drawer-end"
>
    <input id="my-drawer" type="checkbox" class="drawer-toggle" checked={!!$rightDrawerContent} />
    <div class="drawer-content">
        <slot />
    </div>
    <div class="drawer-side">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <label for="my-drawer" class="drawer-overlay" on:click|preventDefault={() => { $rightDrawerContent = undefined; }}></label>
        <div class="w-[90vw] md:w-[50vw] min-h-full bg-base-200 text-base-content p-10 pt-28 shadow-xl">
            {#if $rightDrawerContent}
                <ThreadView event={$rightDrawerContent} />
            {/if}
        </div>
    </div>
</div>