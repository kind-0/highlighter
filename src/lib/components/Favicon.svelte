<script lang="ts">
    export let url: string;

    let domain: string | null = null;
    let faviconUrl: string | null = null;

    function extractDomainFromUrl() {
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname;
      } catch (error) {
        console.error('Invalid URL:', error);
        domain = null;
      }
    }

    function handleImageLoad() {
        faviconUrl = `https://${domain}/favicon.ico`;
    }

    function handleImageError() {
        faviconUrl = null;
    }

    $: extractDomainFromUrl();
</script>

{#if domain !== null}
    <img
        src={`https://${domain}/favicon.ico`}
        alt=""
        style="display: none;"
        on:load={handleImageLoad}
        on:error={handleImageError}
    />

    {#if faviconUrl !== null}
        <img src={faviconUrl} alt="" class={$$props.class} />
    {/if}
{/if}