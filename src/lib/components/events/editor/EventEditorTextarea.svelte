<script lang="ts">
    import { createTextareaAutosize } from '@grail-ui/svelte';

    const { useTextareaAutosize } = createTextareaAutosize();
    export let value: string;
    export let focus: boolean = false;
</script>

<textarea
    bind:value
    on:focus={() => { focus = true }}
    on:blur={() => { focus = false }}
    on:keyup on:keydown on:change
    use:useTextareaAutosize
    style={"z-index: -10;"}
    class="
        focus:outline-none
        text-lg
        shadow
        w-full
        border border-zinc-200
        rounded-xl
        bg-white transition duration-200 ease-in-out
        resize-none
       
" placeholder={`Start typing, or write a nostr id ${focus ? "(npub..., note1..., nevent1...)" : "" }`} />