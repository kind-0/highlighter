<script lang="ts">
	import type { NDKEventStore } from '$lib/stores/ndk';
    import EventCard from '$lib/components/events/card.svelte';

    import NewIcon from '$lib/icons/New.svelte';

    import ToolbarButton from '../components/toolbar/button.svelte';
    import SecretNoteEditor from '../components/secret-notes/editor.svelte';

    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import type { NostrEvent } from '@nostr-dev-kit/ndk';
    import { generateEphemeralSigner, saveEphemeralSigner } from '$lib/signers/ephemeral';

    let privateNote;

    async function newNote() {
        const title = await prompt('Title?');

        if (!title) return;

        const signer = await generateEphemeralSigner();
        const signerUser = await signer.user();

        const encryptedTitle = await signer.encrypt(signerUser, title);

        // generate root event with new key
        privateNote = new NDKEvent($ndk, {
            kind: 30023,
            content: "",
            tags: [
                ["subject", encryptedTitle],
            ],
            pubkey: signerUser.hexpubkey(),
        } as NostrEvent);
        console.log('debug', { privateNote });
        await privateNote.sign(signer);
        await saveEphemeralSigner($ndk, signer, {
            associatedEvent: privateNote,
            metadata: { title },
            mainSigner: $ndk.signer!
        });

        await privateNote.publish();
    }

    let encryptedNotes: NDKEventStore<NDKEvent>;
    let decryptedNotes: Record<string, NDKEvent | null> = {};
    let loadedNoteIds: string[] = [];

    $: if (!encryptedNotes && $currentUser) {
        encryptedNotes = $ndk.storeSubscribe({
            authors: [$currentUser.hexpubkey()],
            kinds: [4, 31023 as number],
            '#p': [$currentUser.hexpubkey()]
        })
    }

    $: {
        if ($encryptedNotes && $encryptedNotes.length > 0 && loadedNoteIds.length < $encryptedNotes.length) {
            console.log('encrypted notes', $encryptedNotes?.length, Object.keys(decryptedNotes).length)
            setTimeout(async () => {
                loadedNoteIds = $encryptedNotes.map((n: NDKEvent) => n.id);

                for (const note of $encryptedNotes) {
                    try {
                        if (!decryptedNotes[note.id]) {
                            await note.decrypt($currentUser!);
                                // if (event.content.key) continue;

                            decryptedNotes[note.id] = note;

                        }
                    } catch (e) {
                        console.error(e);
                    }
                }

                decryptedNotes = decryptedNotes;
            }, 100);
        }
    }

    let loadedNote: NDKEvent | null = null;
</script>

<div class="flex flex-row justify-end">
    <ToolbarButton on:click={newNote}>
        <NewIcon />
        Create new
    </ToolbarButton>
</div>

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
                />
            <!-- {/if} -->
        {/each}
    </div>
{/if}