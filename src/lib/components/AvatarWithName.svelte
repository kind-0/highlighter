<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';

    export let pubkey: string | undefined;
    export let subtitle: string | undefined = undefined;
    export let avatarClass: string = "w-10 h-10";
</script>

<div class="group block flex-shrink-0">
    <div class="flex items-center gap-2">
        <div class="flex-shrink-0">
            <Avatar {pubkey} class={avatarClass} />
        </div>
        <div>
            <p class="text-sm font-medium"><span class={$$props.nameClass}><Name {pubkey} /></span></p>
            <div class="text-xs truncate">
                {#if subtitle}
                    {subtitle}
                {:else if $$slots.bio}
                    <slot name="bio" />
                {/if}
            </div>
        </div>
    </div>
</div>
