<script lang="ts">
    export let klass: string = '';
    export let element: HTMLInputElement | null = null;
    export let value: string = '';
</script>

<input
    bind:value
    bind:this={element}
    on:keydown
    on:keyup
    on:change
    class="
    rounded-lg p-4
    bg-white focus:ring-orange-500 focus:border-orange-500
    dark:bg-zinc-800 dark:text-white {klass}
" {...$$props} />