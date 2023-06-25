<script lang="ts">
    export let type: string = 'primary';
</script>

{#if $$props.href}
    <a
        href={$$props.href}
        on:click
        {...$$props}
        class="
            border rounded-md p-2 px-4
            flex flex-row items-center gap-2
            transition-all duration-200
            {type}
            {$$props['class'] ?? ''}
    ">
        <slot />
    </a>
{:else}
    <button
        on:click
        {...$$props}
        class="
            border rounded-md p-2 px-4
            transition-all duration-200
            {type}
            {$$props['class'] ?? ''}
    ">
        <slot />
</button>
{/if}

<style lang="postcss">
    .primary {
        @apply bg-orange-900/10 hover:bg-orange-900/20
            text-zinc-600 hover:text-black rounded-lg;
    }

    .secondary {
        @apply bg-zinc-700 hover:bg-zinc-600
            text-white
            text-sm;
    }
</style>