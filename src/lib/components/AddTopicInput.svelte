<script lang="ts">
    import Hashtag from "$icons/Hashtag.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string = "";
    export let placeholder = "Add Topic";

    function keydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (value) {
                dispatch("add", value);
                value = "";
            }
        }
    }
</script>

<div class="relative rounded-full flex-grow h-full z-50">
    <div class="pointer-events-none absolute inset-y-0 flex items-center pl-3">
        <Hashtag class="w-8 h-8 text-base-300" />
    </div>
    <input
        tabindex="0"
        type="search"
        autocomplete="off"
        class="
            input input-bordered
            block w-full rounded-full py-1.5 pl-12
            focus:border-0
            focus:ring-2 focus:ring-inset focus:ring-accent2
            !bg-base-200
            text-base-100-content
            text-base-100-placeholder
            text-sm
        "
        {placeholder}
        bind:value
        on:keydown={keydown}
    />
</div>