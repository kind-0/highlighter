<script lang="ts">
    import Button from '$lib/components/buttons/Button.svelte'
    export let href: string = '#';
</script>

<Button class={$$props.class} href={href} on:click>
    <slot />
</Button>