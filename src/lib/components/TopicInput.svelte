<script lang="ts">
    import Tags from "svelte-tags-input";

    export let values: string[] = [];

    let focused = false;
    let _value: string = '';
    let value: string = '';

    $: _value = values.map(v => v.trim()).filter(v => v.length > 0).join(', ');
</script>

{#if focused}
    <div class="rounded-lg">
        <Tags
            bind:tags={values}
            on:blur={() => focused = false}
            allowPaste={true}
            onlyUnique={true}
            allowBlur={true}
            placeholder="Tags"
            class="rounded-lg"
        />
    </div>
{:else}
    {#if values.length > 0}
        <button on:click={() => { focused = true }}>
            <div class="text-zinc-700 text-base whitespace-normal text-left">
                {#each values as v}
                    <span class="inline-flex items-center rounded-full border border-orange-500 px-3 py-1 text-sm font-medium text-orange-500 mr-2 mb-1">#{v}</span>
                {/each}
            </div>
        </button>
    {:else}
        <button
            class="
                border border-orange-500
                text-orange-500
                px-4 py-2 rounded-lg
                text-sm
            "
            on:click={() => focused = true}
        >
            Add tags
        </button>
    {/if}
{/if}

<style>

</style>