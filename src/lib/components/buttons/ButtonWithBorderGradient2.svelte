<script lang="ts">
    export let href: string | undefined = undefined;
    export let rounded: string = 'rounded-lg';
</script>

{#if href}
    <a {href} class="
        p-1 rounded-full from-gradient3 to-gradient4 bg-gradient-to-r
        inline-block
        {$$props.class}
    " on:click>
        <span class="
            block px-6 py-2 font-semibold rounded-full bg-base-100 text-base-100-content hover:bg-transparent transition uppercase whitespace-nowrap
            {$$props.innerClass}
        ">
            <slot />
        </span>
    </a>
{:else}
    <button class="
        p-1 {rounded} from-gradient3 to-gradient4 bg-gradient-to-r
        inline-block
        {$$props.class}
        " on:click>
        <span class="
            block px-6 py-2 font-semibold {rounded} bg-base-100 text-base-100-content hover:bg-transparent transition whitespace-nowrap
            flex-grow h-full flex flex-row items-center justify-center
            {$$props.innerClass}
        ">
            <slot />
        </span>
    </button>
{/if}