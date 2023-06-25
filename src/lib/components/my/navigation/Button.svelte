<script lang="ts">
    import { page } from '$app/stores';

    export let route: string;
    let active: boolean;

    // define active if the current URL starts with the route
    $: {
        active = $page?.url?.pathname === route;
    }
</script>

<a href={route} class="
    group flex gap-x-2 px-2 py-1.5 text-sm font-regular
    w-full transition duration-100 rounded-md
    { active ? 'bg-orange-500 text-white' : 'text-zinc-700 hover:text-black hover:bg-zinc-300/30' }
    {$$props.class}
">
    <slot />
</a>