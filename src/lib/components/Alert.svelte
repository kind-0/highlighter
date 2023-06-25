<script lang="ts">
    export let type: string = 'info';
</script>

<div class="border-l-4 p-4 mt-4 {type} {$$props.class}">
    <div class="flex">
        <div class="flex flex-col gap-4 text-sm">
            <slot />
        </div>
    </div>
</div>

<style lang="postcss">
    .info {
        @apply border-l-stone-400 bg-stone-100 text-stone-600;
    }

    .success {
        @apply border-l-green-400 bg-green-100 text-green-700;
    }

    .warning {
        @apply border-l-orange-400 bg-orange-100 text-orange-700;
    }

    .error {
        @apply border-l-red-400 bg-red-100 text-red-700;
    }
</style>