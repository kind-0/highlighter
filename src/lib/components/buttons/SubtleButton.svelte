<script lang="ts">
    export let handleClick = () => {};
</script>

<button on:click={handleClick} class="btn rounded-full btn-rounded-full w-full h-11 bg-base-300 text-xs font-medium normal-case hover:bg-opacity-30 hover:border hover:border-zinc-400">
    <slot name="btn-content">Subtle Button</slot>
</button>
