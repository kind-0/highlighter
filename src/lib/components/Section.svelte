<script lang="ts">
    export let title: string;
</script>

<div class="flex flex-row items-center justify-between">
    <h1 class="text-4xl font-bold">
        {title}
    </h1>
    <slot name="actions" />
</div>

<div class="overflow-x-auto">
    <slot />
</div>