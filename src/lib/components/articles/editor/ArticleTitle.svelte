<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    export let title: string;
</script>

<Input
    class="
        bg-transparent
        text-4xl p-2
        w-full
        placeholder-base-300-contrast
        rounded-b-none outline-none
        border-0 focus:ring-0 focus-within:ring-0 focus-within:border-0 focus:border-0
        {$$props.class??""}
    "
    placeholder="Title"
    bind:value={title}
    on:keydown
    on:keyup
    on:change
/>