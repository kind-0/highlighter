<script lang="ts">
    import type { NDKTag } from '@nostr-dev-kit/ndk/lib/src/events';
    import { currentUser } from '$lib/store';
    import type { Observable } from 'dexie';
    import type { NDKSubscription } from '@nostr-dev-kit/ndk';

    import NoteInterface from '$lib/interfaces/notes';
    import HighlightInterface from '$lib/interfaces/highlights';

    import CollapsibleCard from '../../components/CollapsibleCard.svelte';
    import FilterFeed from '$lib/components/FilterFeed.svelte';
    import UserBanner from '$lib/components/UserBanner.svelte';

    export let kind = 1;
    export let tags: NDKTag[];
    export let currentUserPubkeys: string[] = [];
    let noteIds: string[];
    let peopleIds: string[];
    let urlTags: string[];

    let prevRawTagList: NDKTag[] = [];

    let noteQuery: Observable<App.Note[]> | undefined;
    let highlightQuery: Observable<App.Highlight[]> | undefined;

    let taggedNotes: App.Note[] = [];
    let taggedNoteIds = new Set();
    let taggedHighlights: App.Highlight[] = [];
    let taggedHighlightIds = new Set();

    let highlightSub: NDKSubscription[] | undefined;

    $: if ($currentUser && !currentUserPubkeys.includes($currentUser.hexpubkey())) {
        currentUserPubkeys.push($currentUser.hexpubkey());
    }

    $: {
        if (prevRawTagList !== tags) {
            prevRawTagList = tags;

            noteIds = [];
            peopleIds = [];
            urlTags = [];

            for (const tag of tags) {
                switch (tag[0]) {
                    case 'a':
                        // const [kind] = tag[1].split(':');
                        break;
                    case 'e':
                        noteIds.push(tag[1]);
                        break;
                    case 'p':
                        peopleIds.push(tag[1]);
                        break;
                    case 'r':
                        urlTags.push(tag[1]);
                        break;
                }
            }

            noteQuery = undefined;
            highlightQuery = undefined;

            if (noteIds.length > 0) {
                noteQuery = NoteInterface.load({ ids: noteIds, kind });
                highlightQuery = HighlightInterface.load({ ids: noteIds });
                highlightSub = HighlightInterface.startStream({ ids: noteIds, kind });
            }
        }
    }

    $: {
        let changes = false;

        if ($noteQuery) {
            for (const note of $noteQuery) {
                if (!taggedNoteIds.has(note.id)) {
                    changes = true;
                    // sort by date
                    taggedNotes.push(note);
                    taggedNoteIds.add(note.id);
                }
            }
        }

        if ($highlightQuery) {
            for (const higlight of $highlightQuery) {
                if (!taggedHighlightIds.has(higlight.id)) {
                    changes = true;
                    taggedHighlights.push(higlight);
                    taggedHighlightIds.add(higlight.id);
                }
            }
        }

        if (changes) {
            taggedNotes = taggedNotes;
            taggedNoteIds = taggedNoteIds;
            taggedHighlights = taggedHighlights;
            taggedHighlightIds = taggedHighlightIds;
        }
    }

    function shouldDisplayTag(tag: NDKTag) {
        switch (tag[0]) {
            case 'a':
                const [kind] = tag[1].split(':');
                return kind === '30023';
            case 'e':
                return true;
            case 'p':
                return false;
            case 'r':
                return true;
        }
    }
</script>

{#each urlTags as tag}
    <div class="h-full">
        <div
            class="flex flex-col h-full"
        >
            <div class="
                shadow
                flex flex-col h-full gap-4
                border border-zinc-200 hover:border-zinc-200
                px-6 pt-6 pb-4 rounded-xl
                bg-white hover:bg-slate-50 transition duration-200 ease-in-out
            " style="max-height: 40rem;">
                {tag}
            </div>
        </div>
    </div>
{/each}

{#each tags as tag}
    {#if shouldDisplayTag(tag)}
        <CollapsibleCard {tag} on:removeItem />
    {/if}
{/each}

<!-- {#each taggedNotes as tag}
    <CollapsibleCard {tag} />
{/each}

{#each taggedHighlights as tag}
    <div class="h-full">
        <Highlight highlight={tag} />
    </div>
{/each}
-->

{#each peopleIds as personId}
    <div class="h-full">
        <UserBanner pubkey={personId} />
    </div>
{/each}

{#if peopleIds.length > 0}
    List feed

    <FilterFeed filter={{
        'authors': peopleIds
    }} />

{/if}