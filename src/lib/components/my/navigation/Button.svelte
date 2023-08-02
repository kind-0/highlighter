<script lang="ts">
    export let route: string;
</script>

<a href={route} class="
    py-1 px-2
    group flex gap-x-2 font-regular
    w-full transition rounded-md
    {$$props.class}
"
    on:dragenter
    on:dragleave
    on:drop
>
    <slot />
</a>
