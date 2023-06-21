{#if $$props.href}
    <a
        href={$$props.href}
        on:click
        {...$$props}
        class="
            border rounded-md
            bg-beige-200 hover:bg-beige-300
            p-2
            flex flex-row items-center gap-2
            transition-all duration-200
            text-zinc-600
            {$$props['class'] ?? ''}
    ">
        <slot />
    </a>
{:else}
    <button
        on:click
        {...$$props}
        class="
            border rounded-md
            bg-beige-200 hover:bg-beige-300
            p-2
            transition-all duration-200
            {$$props['class'] ?? ''}
    ">
        <slot />
</button>
{/if}