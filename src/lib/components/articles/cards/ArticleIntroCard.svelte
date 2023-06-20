<script lang="ts">
    // This component displays a card for an article in a style
    // that would work within a list of articles.

	import type NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/store';
    import ArticlePreview from '../editor/ArticlePreview.svelte';

    export let article: NDKLongForm;

    let availableArticle: NDKLongForm;
    let gettingArticle = false;
    let mounted = false;
    let decrypted = false;

    function articleRequiresDecryption(): boolean {
        return article.kind === 31023;
    }

    onMount(() => { mounted = true });

    $: if (!availableArticle && !gettingArticle && !decrypted && mounted && $ndk.signer && $currentUser) {
        gettingArticle = true;
        if (articleRequiresDecryption()) {
            const encryptedTitle = article.title;

            if (!encryptedTitle) {
                availableArticle = article;
            } else {
                console.log(`trying to decrypt ${encryptedTitle}`)
                $ndk.signer.decrypt($currentUser, encryptedTitle).then((decryptedTitle) => {
                    decrypted = true;
                    availableArticle = article;
                    availableArticle.title = decryptedTitle;
                });
            }
        } else {
            availableArticle = article;
        }
    }
</script>

{#if availableArticle}
    {#await availableArticle.decrypt($currentUser) then}
        <ArticlePreview
            href={`/my/notes/${availableArticle.encode()}`}
            title={availableArticle.title??''}
            body={availableArticle.content}
            tags={availableArticle.tags}
            class="md:px-6 md:py-6 {$$props.class??""}"
            titleClass="md:text-2xl"
        />
    {/await}
{/if}