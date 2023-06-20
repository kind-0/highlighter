<script lang="ts">
	import type { NDKEventStore } from '$lib/stores/ndk';
    import EventCard from '$lib/components/events/card.svelte';

    import NewIcon from '$lib/icons/New.svelte';

    import ToolbarButton from '../components/toolbar/button.svelte';

    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import NDKLongForm from '$lib/ndk-kinds/long-form';

    import { Card } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    let encryptedNotes: NDKEventStore<NDKEvent>;
    let decryptedNotes: Record<string, NDKEvent | null> = {};
    let loadedNoteIds: string[] = [];

    let encryptedLongForms: NDKEventStore<NDKLongForm>;
    let decryptingIds = new Set<string>();
    let decryptedLongForms: Record<string, string> = {};

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

    // $: {
    //     if ($encryptedNotes && $encryptedNotes.length > 0 && loadedNoteIds.length < $encryptedNotes.length) {
    //         console.log('encrypted notes', $encryptedNotes?.length, Object.keys(decryptedNotes).length)
    //         setTimeout(async () => {
    //             loadedNoteIds = $encryptedNotes.map((n: NDKEvent) => n.id);

    //             for (const note of $encryptedNotes) {
    //                 try {
    //                     if (!decryptedNotes[note.id]) {
    //                         await note.decrypt($currentUser!);
    //                             // if (event.content.key) continue;

    //                         decryptedNotes[note.id] = note;

    //                     }
    //                 } catch (e) {
    //                     console.error(e);
    //                 }
    //             }

    //             decryptedNotes = decryptedNotes;
    //         }, 100);
    //     }
    // }

    let mounted = false;

    onMount(() => {
        setTimeout(() => {
            mounted = true;
        }, 1000);
    });

    $: if (mounted && $currentUser && $ndk.signer && $encryptedLongForms.length !== Object.keys(decryptedLongForms).length) {
        for (const longForm of $encryptedLongForms) {
            console.log('will decrypt', longForm.tagValue('title'), longForm.rawEvent())
            const encode = longForm.encode();
            if (!decryptingIds.has(encode)) {
                decryptingIds.add(encode);

                if (!longForm.title) {
                    decryptedLongForms[encode] = longForm.tagValue('d')!;
                    continue;
                }

                $ndk.signer.decrypt($currentUser, longForm.title)
                    .then((title: string) => {
                        console.log('decrypted', title);
                        decryptedLongForms[encode] = title;
                    });
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

{#if $encryptedNotes}
    <div class="grid grid-flow-row md:grid-cols-2 xl:grid-cols-4 gap-4">
        {#each Object.values($encryptedNotes).filter(n => !!n) as note}
            <!-- {#if note?.content}
                <a
                    href="/my/notes/{note.encode()}"
                    class="flex flex-col"
                    on:click|preventDefault={() => loadedNote = note}
                >
                    <div class="
                        shadow
                        flex flex-col h-full gap-4
                        border border-zinc-200 hover:border-zinc-200
                        px-6 pt-6 pb-4 rounded-xl
                        bg-white hover:bg-slate-50 transition duration-200 ease-in-out
                    " style="max-height: 40rem;">
                        <div class="flex-1 truncate px-4 py-2 text-sm">
                            <div class="text-lg font-medium text-gray-900 hover:text-gray-600">
                                {note?.content}
                            </div>
                            <div class="flex flex-row gap-4 items-start text-sm text-zinc-400">
                                {new Date(note.created_at*1000).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </a>
            {:else if note} -->
                <EventCard
                    event={note}
                    skipHeader={true}
                    skipFooter={true}
                    replies={[]}
                />
            <!-- {/if} -->
        {/each}
    </div>
{/if}