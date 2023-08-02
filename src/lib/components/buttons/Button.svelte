<script lang="ts">
    export let type: string = 'primary';
</script>

{#if $$props.href}
    <a
        href={$$props.href}
        on:click
        {...$$props}
        class="
            btn btn-{$$props.type}
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
        btn btn-{$$props.type}
            transition-all duration-200
            {type}
            {$$props['class'] ?? ''}
    ">
        <slot />
</button>
{/if}
