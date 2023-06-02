<script lang="ts">
    export let href: string | undefined = undefined;
    export let klass: string = '';
</script>

{#if href}
    <a {href}
        class="
    bg-primary-500 hover:bg-primary-600
    text-white font-semibold
    rounded-full px-6 py-2
    transition-colors duration-200
    {klass}
    ">
        <slot />
    </a>
{:else}
    <button on:click class="
        bg-primary-500 hover:bg-primary-600
        text-white font-semibold
        rounded-full px-6 py-2
        transition-colors duration-200
        {klass}
    ">
        <slot />
    </button>
{/if}