<script lang="ts">
    import Console from '$lib/components/Console/Console.svelte';
    import Examples from '$lib/components/Console/Examples.svelte';
    import { page } from '$app/stores';
    import { searchQuery } from '$lib/stores/search';
    import MainWithRightSidebar from '$lib/layouts/MainWithRightSidebar.svelte';
    import RightSidebar from './components/RightSidebar/RightSidebar.svelte';

    let url: string = $page.url.searchParams.get('url') || '';
    let authorPubkey: string = $page.url.searchParams.get('author') || '';
</script>

<svelte:head>
	<title>Highlighter Console</title>
	<meta name="description" content="Unleash valuable words from their artificial silos" />
</svelte:head>

<MainWithRightSidebar>
    <Console {authorPubkey} />
    {#if !$searchQuery}
        <Examples bind:url />
    {/if}

    <div slot="right-sidebar">
        <RightSidebar />
    </div>
</MainWithRightSidebar>