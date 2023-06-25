<script lang="ts">
    import classnames from "classnames";

    import Button from "./Button.svelte";

    import CopyIcon from '$lib/icons/Copy.svelte';
    import CheckIcon from '$lib/icons/Check.svelte';
    import { Tooltip } from "flowbite-svelte";

    export let data: string | object;
    export let tooltip: string | undefined = undefined;
    export let comp: typeof Button = Button;
    export let label: string | undefined = undefined;

    let strData: string;
    let copied = false;

    if (data instanceof Object)
        strData = JSON.stringify(data, null, 2);
    else
        strData = data;

    function copy() {
        navigator.clipboard.writeText(strData);
        copied = true;

        setTimeout(() => { copied = false; }, 1500);
    }
</script>

<!-- use the comp component -->
<svelte:component
    this={comp}
    class={$$props.class}
    on:click={copy}
>
    <div class="flex flex-row items-center gap-2">
        {#if copied}
            <CheckIcon class={classnames('w-4 h-4', $$props.iconClass)} />
        {:else }
            <CopyIcon class={classnames('w-4 h-4', $$props.iconClass)} />
        {/if}

        {#if label}
            {copied ? 'Copied' : label}
        {/if}
    </div>

    {#if $$slots.default}
        <slot />
    {/if}
</svelte:component>
{#if tooltip}
    <Tooltip color="white">{tooltip}</Tooltip>
{/if}
