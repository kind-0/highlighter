<button on:click class="
    bg-primary-500 hover:bg-primary-600
    text-white font-semibold
    uppercase text-lg
    rounded-md px-6 py-4
    transition-colors duration-200
    tracking-wider
    {$$props.class??''}
">
    <slot />
</button>