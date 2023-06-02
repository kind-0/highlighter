<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div role="dialog" class="modal" transition:fade>
    <div class="
        rounded-xl p-6
        shadow-xl
        bg-white
        dark:bg-zinc-900 dark:text-white
        flex flex-col gap-8
        relative
        max-w-prose w-full
    " style="pointer-events: auto;">
        <slot />
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        /* allow click-through to backdrop */
        pointer-events: none;
    }
</style>