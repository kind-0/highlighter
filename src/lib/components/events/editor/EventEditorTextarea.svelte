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
    class="
        focus:outline-none
        textarea textarea-bordered
        bg-base-300
        text-lg
        shadow
        w-full
        rounded-xl
        resize-none
" placeholder={`Start typing, or write a nostr id ${focus ? "(npub..., note1..., nevent1...)" : "" }`} />