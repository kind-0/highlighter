<script lang="ts">
    import { unsavedLongFormStore } from '$lib/stores/long-form';
    import { Cloud, Pen } from 'phosphor-svelte';
    import MenuItem from '../sidebars/MenuItem.svelte';
</script>


{#if $unsavedLongFormStore.length > 0}
    <li class="menu-title flex flex-row items-center">
        <Pen class="w-4 h-4 mr-2" />
        <div class="flex-grow">UNSAVED REFLECTIONS</div>
    </li>

    {#each $unsavedLongFormStore as item (item.encode())}
        <MenuItem
            href={`/notes/${item.encode()}/edit`}
            innerClass="flex flex-row items-center justify-between flex-grow"
        >
            <div class="flex flex-row items-center gap-2 w-full">
                <div class="truncate">{item.title??"Unsaved note"}</div>
            </div>

            <div class="badge badge-accent badge-sm">
                {item.content.length}
            </div>
        </MenuItem>
    {/each}
{/if}
