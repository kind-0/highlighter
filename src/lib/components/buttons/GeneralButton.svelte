<script lang="ts">
    export let handleClick = () => {};
</script>

<button on:click={handleClick} class="btn btn-outline btn-rounded-full rounded-full border-accent2 bg-base-200 text-base-100-content text-sm md:text-base hover:border-accent2 hover:bg-accent2 hover:bg-opacity-20 hover:text-base-100-content">
    <slot name="btn-content">General Button</slot>
</button>
