<script lang="ts">
    import { EncryptedLongForm, loadEncryptedLongForm } from "$lib/utils/long-form";
    import { page } from '$app/stores';
    import ndk from '$lib/stores/ndk';

    import { onMount } from "svelte";

    const { naddr } = $page.params;

    let loadLongForm: Promise<EncryptedLongForm | undefined> | undefined = undefined;

    onMount(() => {
        setTimeout(() => {
            loadLongForm = loadEncryptedLongForm($ndk, naddr);
        }, 500);
    })
</script>

{#if loadLongForm}
    {#await loadLongForm}
        Loading
    {:then longForm}
        {JSON.stringify(longForm)}
        <!-- <SecretNodeEditor title={longForm.title} /> -->
    {:catch error}
        {error.message}
    {/await}
{/if}