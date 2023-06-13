<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import { Card } from "flowbite-svelte";

    export let list: NDKList;
</script>

<Card class={$$props.class}>
    <div class="text-lg font-medium text-gray-900 hover:text-gray-600">
        {list.name}
    </div>

    <div class="flex flex-row gap-4 items-start text-sm text-zinc-400">
        {list.description ?? new Date(list.created_at * 1000).toLocaleString()}
    </div>
</Card>