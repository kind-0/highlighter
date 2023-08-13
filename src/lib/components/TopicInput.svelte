<script lang="ts">
    import MenuItem from '$components/sidebars/MenuItem.svelte';
    import Input from '$lib/components/Input.svelte';
    import { CaretDown, Hash } from 'phosphor-svelte';

    export let values: string[] = [];

    function addTopic(name: string) {
        name = name.replace(/^#/, '').trim();

        if (values.includes(name)) return;
        values.push(name);
        values = values;
    }

    function toggleTopic(name: string) {
        if (values.includes(name)) {
            values = values.filter(t => t !== name);
        } else {
            addTopic(name);
        }

        values = values;
    }

    function keyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            addTopic(value);
            value = '';
        }
    }

    let value: string = '';
</script>

<div class="dropdown dropdown-start">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label tabindex="0" class="btn m-1 {$$props.class??''}">
        <div class="flex flex-row items-center gap-2 font-normal whitespace-nowrap">
            <Hash class="w-6 h-6" />
            {#if values.length > 0}
                <span class="truncate">
                    {#if values.length > 3}
                        {values.length} tags
                    {:else}
                        {values.slice(0, 3).join(', ')}
                    {/if}
                </span>
            {:else}
                Add tags
                <CaretDown class="w-4 h-4" />
            {/if}
        </div>
    </label>
    <div class="menu overflow-x-hidden z-[1] p-2 shadow rounded-box bg-base-300 overflow-y-auto max-h-96 dropdown-content ">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul tabindex="0" class="">
                <Input
                    placeholder="Add topic"
                    autofocus={true}
                    on:keydown={keyDown}
                    bind:value
                />
            {#each values as topic}
                <MenuItem
                    on:click={(e) => { e.preventDefault(); toggleTopic(topic); }}
                >
                    {topic}
                </MenuItem>
            {/each}
        </ul>
    </div>
</div>