<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import Button from '$lib/components/buttons/Button.svelte'
    export let href: string = '#';

    const dispatch = createEventDispatcher();
</script>

<Button class={$$props.class} href={href} on:click={() => dispatch('click')}>
    <slot />
</Button>