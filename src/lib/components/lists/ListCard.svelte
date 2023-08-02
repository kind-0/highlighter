<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";

    export let list: NDKList;
    export let linkPrefix = '/lists/'
</script>

<a href={`${linkPrefix}${list.encode()}`} class="card">
    <div class="card-body">
        <div class="card-title">{list.name}</div>

        <div class="flex flex-row gap-4 items-start text-sm">
            {list.description ?? new Date(list.created_at * 1000).toLocaleString()}
        </div>

        <div class="flex flex-row gap-4 items-start text-sm">
            {list.items.length} items
        </div>
    </div>
</a>

<style>
    .full-width-card {
        width: 100%;
    }
</style>