<script lang="ts">
    // This component displays a card for an article in a style
    // that would work within a list of articles.

	import type NDKLongForm from '$lib/ndk-kinds/long-form';
    import { Card } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/store';
    import ArticlePreview from '../editor/ArticlePreview.svelte';
    import { createDraggableEvent } from '$lib/utils/draggable';

    export let article: NDKLongForm;

    function articleRequiresDecryption(): boolean {
        return article.kind === 31023;
    }

    const articlePromise = new Promise<NDKLongForm>(async (resolve, reject) => {
        if (articleRequiresDecryption()) {
            const encryptedTitle = article.title;

            if (!encryptedTitle) {
                resolve(article);
            } else {
                const decryptedTitle = await $ndk.signer!.decrypt($currentUser!, encryptedTitle);
                await article.decrypt($currentUser!);
                const availableArticle = article;
                availableArticle.title = decryptedTitle;
                resolve(availableArticle);
            }
        } else {
            resolve(article);
        }
    });

    function articleLink() {
        if (article.kind === 31023) {
            return `/my/notes/${article.encode()}`;
        } else {
            return `/a/${article.encode()}`;
        }
    }

    const draggable = createDraggableEvent(article);
</script>

{#await articlePromise then article}
    <div use:draggable>
        <ArticlePreview
            href={articleLink()}
            title={article.title??''}
            body={article.summary??article.content}
            tags={article.tags}
            image={article.image}
            class="md:px-6 md:py-6 {$$props.class??""}"
            titleClass="md:text-xl font-bold"
        />
    </div>
{:catch e}
    <p>{error}</p>
{/await}