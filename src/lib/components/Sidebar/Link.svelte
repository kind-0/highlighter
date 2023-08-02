<script lang="ts">
    import { page } from "$app/stores";

    export let href: string;
</script>


<li class={$$props.class}>
    <a
        {href}
        class="flex flex-row items-center gap-2"
        class:text-accent={$page.url.pathname === href}
    ><slot /></a>
</li>