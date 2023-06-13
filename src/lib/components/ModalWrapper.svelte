<script lang="ts">
  import { closeModal } from "svelte-modals";
    import { fade } from "svelte/transition";

    export let klass: string = '';
</script>

<div class="
    fixed
    modal
    h-screen top-0
    bottom-0
    flex justify-center items-center
    z-10
    w-screen
" transition:fade on:click={closeModal}>
    <div class="
        mx-2
        sm:mx-auto
        rounded-lg sm:rounded-xl p-6
        shadow-xl
        bg-white
        dark:bg-zinc-900 dark:text-white
        flex flex-col gap-8
        relative
        max-w-prose w-full
        overflow-y-auto
        {klass}
    " style="pointer-events: auto; max-height: 80vh;" on:click|stopPropagation={()=>{}}>
        <slot />
    </div>
</div>
