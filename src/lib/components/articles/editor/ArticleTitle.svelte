<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    export let title: string;
</script>

<Input
    class="
        bg-white text-2xl border-2 border-gray-300 rounded-lg p-2
        w-full
    "
    bind:value={title}
/>