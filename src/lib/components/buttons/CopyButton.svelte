<script lang="ts">
    import Button from "./Button.svelte";

    import CopyIcon from '$lib/icons/Copy.svelte';
    import CheckIcon from '$lib/icons/Check.svelte';
    import { Tooltip } from "flowbite-svelte";

    export let data: string;
    export let tooltip: string | undefined = undefined;

    let copied = false;

    function copy() {
        navigator.clipboard.writeText(data);
        copied = true;

        setTimeout(() => { copied = false; }, 1500);
    }
</script>

<Button class="w-10 h-10" on:click={copy}>
    {#if copied}
        <CheckIcon />
    {:else }
        <CopyIcon />
    {/if}
</Button>
{#if tooltip}
    <Tooltip color="white">{tooltip}</Tooltip>
{/if}