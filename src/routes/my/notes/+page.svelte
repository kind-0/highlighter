<script lang="ts">
	import type { NDKEventStore } from '$lib/stores/ndk';
    import EventCard from '$lib/components/events/card.svelte';

    import NewIcon from '$lib/icons/New.svelte';

    import ToolbarButton from '../components/toolbar/button.svelte';

    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import NDKLongForm from '$lib/ndk-kinds/long-form';

    import { Card } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    let encryptedLongForms: NDKEventStore<NDKLongForm>;
    let decryptingLongFormIds = new Set<string>();
    let decryptedLongForms: Record<string, string> = {};

    let encryptedNotes: NDKEventStore<NDKEvent>;
    let decryptingNoteIds = new Set<string>();
    let decryptedNotes: Record<string, NDKEvent> = {};

    $: if (!encryptedNotes && $currentUser) {
        encryptedNotes = $ndk.storeSubscribe({
            authors: [$currentUser.hexpubkey()],
            kinds: [4 as number],
            '#p': [$currentUser.hexpubkey()]
        })
    }

    $: if (!encryptedLongForms && $currentUser) {
        encryptedLongForms = $ndk.storeSubscribe({
            authors: [$currentUser.hexpubkey()],
            kinds: [31023 as number],
        }, { closeOnEose: false }, NDKLongForm)
    }

    let mounted = false;

    onMount(() => {
        mounted = !!($currentUser && $ndk.signer);
        setTimeout(() => { mounted = true; }, 250);
    });

    // Decrypt long-forms
    $: if (mounted && $currentUser && $ndk.signer && $encryptedLongForms.length !== decryptingLongFormIds.size) {
        for (const longForm of $encryptedLongForms) {
            const encode = longForm.encode();
            if (!decryptingLongFormIds.has(encode)) {
                decryptingLongFormIds.add(encode);

                if (!longForm.title) {
                    decryptedLongForms[encode] = longForm.tagValue('d')!;
                    continue;
                }

                $ndk.signer.decrypt($currentUser, longForm.title)
                    .then((title: string) => {
                        decryptedLongForms[encode] = title;
                    });
            }
        }
    }

    // Decrypt notes
    $: if (mounted && $currentUser && $ndk.signer && $encryptedNotes.length !== decryptingNoteIds.size) {
        for (const note of $encryptedNotes) {
            const encode = note.encode();
            if (!decryptingNoteIds.has(encode)) {
                decryptingNoteIds.add(encode);

                note.decrypt($currentUser, $ndk.signer)
                    .then(() => { decryptedNotes[encode] = note; });
            }
        }
    }

    let loadedNote: NDKEvent | null = null;
</script>

<div class="flex flex-row justify-end">
    <ToolbarButton href="/my/notes/new">
        <NewIcon />
        Create new
    </ToolbarButton>
</div>

{#each Object.keys(decryptedLongForms) as id (id)}
    {#key decryptedLongForms[id]}
        <Card href={`/my/notes/${id}`}>
            {decryptedLongForms[id] || 'Untitled'}
        </Card>
    {/key}
{/each}

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
{/if}