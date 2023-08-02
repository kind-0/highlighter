<script lang="ts">
    import { closeModal } from "svelte-modals";
    import { fade } from "svelte/transition";

    export let title: string | undefined;
    export let subtitle: string | undefined;
</script>

<div class="
    fixed
    h-screen top-0 bottom-0
    flex justify-center items-center
    z-10
    w-screen
" transition:fade on:click={closeModal}>
    <div class="
        card
        rounded-lg sm:rounded-xl
        max-w-3xl
        shadow-xl
        flex flex-col gap-8
        relative
        overflow-y-auto
        {$$props.class}
    " style="pointer-events: auto; max-height: 80vh;" on:click|stopPropagation={()=>{}}>
        {#if title}
            <div class="flex flex-col gap-2 items-center p-8">
                <div class="card-title text-base-100-content text-4xl font-bold">
                    {title}
                </div>

                {#if subtitle}
                    <div class="text-sm text-accent2">
                        {subtitle}
                    </div>
                {/if}
            </div>
        {/if}
        <div class="card-body">
            <slot />
        </div>
    </div>
</div>
