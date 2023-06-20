<script lang="ts">
    import { createTextareaAutosize } from '@grail-ui/svelte';

    const { useTextareaAutosize } = createTextareaAutosize();

    export let value = '';
    export let element: HTMLTextAreaElement | null = null;
</script>

<textarea
    use:useTextareaAutosize
    bind:value
    bind:this={element}
    on:keydown
    on:keyup
    on:change
    {...$$props}
    class="
    rounded-lg p-4
    text-lg
    bg-white focus:ring-orange-500 focus:border-orange-500
    resize-none
    dark:bg-zinc-800 dark:text-white {$$props.class}
"></textarea>