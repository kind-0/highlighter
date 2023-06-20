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