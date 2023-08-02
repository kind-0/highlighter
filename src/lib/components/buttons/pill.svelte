<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let group: string;
    export let value: string;

    $: active = group === value;

    function onClick() {
        const prevValue = group;
        group = value;
        if (prevValue !== value)
            dispatch("change", value);
    }
</script>

<button class="
    flex flex-row gap-2 items-center
    tracking-wider p-3
    outline-none
    rounded-lg
    transition duration-150
    {active ? 'font-semibold' : 'font-normal'}
    {active ? 'text-accent-focus-content' : ' text-base-100-content hover:text-base-100-content'}
    {active ? 'bg-accent-focus' : 'bg-transparent hover:bg-base-300'}
    " on:click={onClick}
>
    <slot />
</button>