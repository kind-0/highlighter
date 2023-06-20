<script lang="ts">
    import { Editor, Viewer } from 'bytemd';
    import gfm from '@bytemd/plugin-gfm'
    import 'bytemd/dist/index.css';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value: string;

    const plugins = [
        gfm(),
        // Add more plugins here
    ]

    function handleChange(e: any) {
        value = e.detail.value

        dispatch('change', e.detail.value);
    }
</script>

<Editor
    bind:value
    {plugins}
    on:change={handleChange}
/>
