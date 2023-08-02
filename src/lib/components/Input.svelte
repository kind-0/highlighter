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
        input input-bordered
    {klass}
" {...$$props} />