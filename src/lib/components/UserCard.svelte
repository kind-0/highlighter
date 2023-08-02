<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';

    export let pubkey: string | undefined = undefined;
    export let subtitle: string | undefined = undefined;
</script>

<div class="group block flex-shrink-0 w-full bg-base-300 text-base-300-content">
    <div class="flex flex-row gap-8">
        <div class="flex flex-row gap-3.5 items-center overflow-hidden">
            <div class="flex-shrink-0">
                <Avatar {pubkey} class="w-12 h-12" />
            </div>
            <div class="w-4/5">
                <p class="text-base font-medium truncate">
                    <Name {pubkey} />
                </p>

                {#if subtitle}
                    <p class="text-sm font-medium truncate">
                        {subtitle}
                    </p>
                {/if}
            </div>
        </div>

        {#if $$slots.right}
            <div class="flex items-center justify-end">
                <slot name="right" />
            </div>
        {/if}
    </div>
</div>