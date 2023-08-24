<script lang="ts">
    import { page } from "$app/stores";

    export let href: string = '#';
    export let active: boolean = false;

    $: active = $page.url.pathname === href;
</script>

<li class={$$props.class}>
    <a
        {href}
        class="
            flex flex-row flex-grow
            text-base-100-content font-light
            {active ? ($$props.activeClass??"border-l-accent2") : ""}
        "
        class:active={active}
        on:click
    >
        <span class="truncate {$$props.innerClass}">
            <slot />
        </span>
    </a>
</li>

<style>
    li a.active {
        @apply bg-transparent;
        @apply border-l-4 rounded-l-none -ml-2 pl-5;
        @apply text-base-100-content;
    }
</style>