<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import { Card } from "flowbite-svelte";

    export let list: NDKList;

</script>
 
<Card class="max-w-full">
    <a
    href={`/my/lists/${list.encode()}`}
    class="flex flex-col gap-4 ">
        <div class="flex flex-col gap-2">
            <div class="text-lg font-medium text-gray-900 hover:text-gray-600">
                {list.name}
            </div>

            <div class="flex flex-row gap-4 items-start text-sm text-zinc-400">
                {list.description ?? new Date(list.created_at * 1000).toLocaleString()}
            </div>
        </div>

        <div class="flex flex-row gap-4 items-start text-sm text-zinc-400">
            {list.items.length} items
        </div>
    </a>
</Card>

<style>
    .full-width-card {
        width: 100%;
    }
</style>