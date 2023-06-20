<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    export let title: string;
</script>

<Input
    class="
        bg-white text-4xl p-2
        font-black
        w-full
        text-zinc-800
        placeholder-zinc-300
        rounded-b-none outline-none
        border-0 focus:ring-0 focus-within:ring-0 focus-within:border-0 focus:border-0
    "
    placeholder="Title"
    bind:value={title}
    on:keydown
/>