<script lang="ts">
    import NewIcon from '$lib/icons/New.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import NDKArticle from "@nostr-dev-kit/ndk";

    import { onMount } from 'svelte';
    import ArticleIntroCard from '$lib/components/articles/cards/ArticleIntroCard.svelte';

    import { longFormStore } from '$lib/stores/long-form';
    import { derived } from 'svelte/store';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { Plus, Scroll } from 'phosphor-svelte';


    const sortedEntries = derived(longFormStore, ($longFormStore) => {
        if (!$longFormStore) return [];

        return Array.from($longFormStore.values())
            .sort((a, b) => b.created_at! - a.created_at!);
    });

    // $: if (!encryptedNotes && $currentUser) {
    //     encryptedNotes = $ndk.storeSubscribe({
    //         authors: [$currentUser.hexpubkey()],
    //         kinds: [4 as number],
    //         '#p': [$currentUser.hexpubkey()]
    //     })
    // }

    // $: if (!encryptedLongForms && $currentUser) {
    //     encryptedLongForms = $ndk.storeSubscribe({
    //         authors: [$currentUser.hexpubkey()],
    //         kinds: [31023 as number],
    //     }, { closeOnEose: false }, NDKArticle)
    // }

    // Decrypt notes
    // $: if (mounted && $currentUser && $ndk.signer && $encryptedNotes.length !== decryptingNoteIds.size) {
    //     for (const note of $encryptedNotes) {
    //         const encode = note.encode();
    //         if (!decryptingNoteIds.has(encode)) {
    //             decryptingNoteIds.add(encode);

    //             note.decrypt($currentUser, $ndk.signer)
    //                 .then(() => { decryptedNotes[encode] = note; });
    //         }
    //     }
    // }
</script>


<div class="flex flex-col w-full">
    <PageTitle title="Private Notes" subtitle="Encrypted notes to organize your thoughts">
        <a href="/notes/new" class="btn btn-primary">
            <NewIcon />
            new
        </a>
    </PageTitle>


    {#if $sortedEntries}
        {#each $sortedEntries as longForm (longForm.encode())}
            <ArticleIntroCard
                article={longForm}
            />
        {/each}
    {/if}

    {#if !$sortedEntries || $sortedEntries.length === 0}
        <div class="text-center mt-14 flex flex-col items-center max-w-prose mx-auto">
            <Scroll weight="thin" class="h-24 w-24" />
            <h1 class="mt-2 text-3xl font-bold">
                Private notes
            </h1>
            <h3 class="mt-2 text-lg font-semibold">
                Capture thoughts and ideas,
                with any kind of nostr event.
            </h3>

            <div class="mt-6">
                <a href="/notes/new" class="btn btn-neutral">
                    <Plus class="w-4 h-4 mr-2" />
                    New Private Note
                </a>
            </div>
        </div>
    {/if}

    <!--
    {#if decryptedNotes}
        <div class="grid grid-flow-row md:grid-cols-2 xl:grid-cols-4 gap-4">
            {#each Object.values(decryptedNotes).filter(n => !!n) as note}
                <EventCard
                    event={note}
                    skipHeader={true}
                    skipFooter={true}
                    replies={[]}
                />
            {/each}
        </div>
    {/if} -->
</div>