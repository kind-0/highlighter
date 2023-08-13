<script lang="ts">
    export let icon: any | undefined = undefined;
    export let title: string;
</script>

<div class="bg-base-200 w-full rounded-box px-6 py-2">
    <div class="
        border-b border-base-300 -mx-6 px-6 pt-2 pb-4
    ">
        <div class="flex flex-row gap-6 items-center hover:!bg-transparent">
            {#if icon}
                <svelte:component this={icon} class="w-12 h-12" />
            {/if}

            <div class="text-base-100-content">
                {title}
            </div>
        </div>
    </div>

    <slot />
</div>