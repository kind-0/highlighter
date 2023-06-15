<script lang="ts">
    export let value: string;
    export let focus: boolean = false;
</script>

<textarea
    bind:value
    on:focus={() => { focus = true }}
    on:blur={() => { focus = false }}
    on:keyup on:keydown on:change
    class="
        focus:outline-none
        text-lg
        {focus ? 'min-h-28' : 'min-h-14'}
        sm:mb-4
        shadow
        w-full
        border border-zinc-200
        rounded-xl
        bg-white transition duration-200 ease-in-out
        resize-none
" placeholder={`Start typing, or write a nostr id ${focus ? "(npub..., note1..., nevent1...)" : "" }`} />