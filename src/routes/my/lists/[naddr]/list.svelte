<script lang="ts">
    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import BookmarkListInterface, { deleteList } from '$lib/interfaces/bookmark-list';

    import NoteVisibility from '../../components/note/visibility.svelte';
    import PageTitle from '../../components/PageTitle.svelte';
    import NoteEditor from '../../components/note-editor.svelte';
    import Tags from './tags.svelte';
    import { onDestroy } from 'svelte';
    import { NDKEvent, NDKPrivateKeySigner, NDKSubscription, NDKUser } from '@nostr-dev-kit/ndk';
    import type { NDKTag, NostrEvent } from '@nostr-dev-kit/ndk/lib/src/events';
    import { nip19 } from 'nostr-tools';
    import { saveEphemeralSigner } from '$lib/signers/ephemeral';
    import EphemeralKey from './EphemeralKey.svelte';
    import FilterFeed from '$lib/components/FilterFeed.svelte';

    export let naddr: string;
    let prevNaddr: string;

    let currentNpub;
    let bookmarkLists, bookmarkList: App.BookmarkList | null = null;
    let delegatedName: string;
    let tags: NDKTag[] = [];
    let encryptedTags: NDKTag[] = [];

    let activeSubs: NDKSubscription[] = [];

    /**
     * Establishes what pubkeys are going to be treated as
     * "current user"'s pubkeys
     */
    let currentUserPubkeys: string[] = [];

    async function loadbookmarkLists() {
        const user = await $ndk.signer?.user();

		if (!user) {
            setTimeout(() => {
                loadbookmarkLists();
            }, 100);
            return;
		}

		currentNpub = user.npub;

		const opts = { naddr };

        if (naddr) {
            bookmarkLists = BookmarkListInterface.load(opts);
            activeSubs = BookmarkListInterface.startStream(opts);
        }
    }

    function removeSubscription() {
        for (const sub of activeSubs) {
            sub.stop();
        }
    }

    onDestroy(() => {
        removeSubscription();
    });

    let listEvent: NDKEvent;

    $: {
        // reset
        if (naddr !== prevNaddr) {
            prevNaddr = naddr;
            encryptedTags = [];
            tags = [];
            bookmarkList = null;
            isNewSigner = true;
            removeSubscription();
            loadbookmarkLists();
        } else {
            if ($currentUser) {
                currentUserPubkeys = [$currentUser.hexpubkey()];
                currentUserPubkeys = currentUserPubkeys;
            }

            if ($bookmarkLists && $bookmarkLists[0] && bookmarkList?.createdAt !== $bookmarkLists[0].createdAt) {
                bookmarkList = $bookmarkLists[0];
                listEvent = new NDKEvent($ndk, JSON.parse(bookmarkList.event));
                tags = listEvent.tags;

                getDelegatedSignerName(bookmarkList).then((name) => {
                    delegatedName = name;
                });
            }
        }
	}

    /**
     * Decrypt the content of this list, where secret tags might
     * have been stored.
     */
    async function decryptTags() {
        try {
            if (listEvent.content.length > 0) {
                await listEvent.decrypt($currentUser!);
                const a = JSON.parse(listEvent.content);
                if (a && a[0]) {
                    encryptedTags = a;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    async function save() {
        if (!addNewItemValue || addNewItemValue.length === 0) {
            return;
        }

        let tag: NDKTag = [];

        if (addNewItemValue.startsWith('http')) {
            tag = ['r', addNewItemValue];
        } else {
            const decode = nip19.decode(addNewItemValue);
            switch (decode.type) {
                case 'note':
                    tag = ['e', decode.data as string];
                    break;
                case 'naddr':
                    const { kind, pubkey, identifier } = decode.data;
                    tag = ['a', `${kind}:${pubkey}:${identifier}`];
                    break;
                case 'nprofile':
                    tag = ['p', decode.data.pubkey as string];
                    break;
                case 'npub':
                    tag = ['p', decode.data as string];
                    break;
                case 'nevent':
                    tag = ['e', decode.data.id as string];
                    break;
                default:
                    alert("not sure how to interpret that");
                    return;
            }
        }

        listEvent.created_at = Math.floor(Date.now() / 1000);
        listEvent.tags.push(tag);
        await listEvent.sign();
        await listEvent.publish();
        addNewItemValue = '';
    }

    let newItemType: string | undefined;
    let addNewItemValue = '';
    let newItemVisibility = 'Delegated';

    let listSigner = NDKPrivateKeySigner.generate();
    let listSignerUser: NDKUser;
    let isNewSigner: boolean;
    let showSaveButton = false;

    function onNewItemChange() {
        const patterns: string[] = ['npub1', 'naddr', 'note1', 'nprofile', 'nevent'];
        let isNotMatching = true;

        for (const pattern of patterns) {
            if (addNewItemValue.startsWith(pattern.slice(0, addNewItemValue.length))) {
                isNotMatching = false;
                break;
            }
        }

        if (addNewItemValue.match(/ /) || isNotMatching) {
            newItemType = 'note'
        } else {
            newItemType = undefined;
        }

        if (newItemType !== 'note' && addNewItemValue.length > 3) {
            showSaveButton = true;
            newItemVisibility = 'Public';
        }
    }

    async function getDelegatedSignerName(list: App.BookmarkList | null) {
        let name;

        if (!list) {
            return 'unknown';
        }

        if (!$currentUser?.profile) {
            await $currentUser?.fetchProfile();
        }

        if ($currentUser?.profile?.name) {
            name = $currentUser.profile.displayName + `'s `;
        }

        return name + list.title;
    }

    /**
     * This callback is called when the user saves from the note editor.
     *
     * If the note has been created with a delegated signer, and the
     * key has not been saved yet, we save it here.
     */
    async function onNoteEditorSaved(e: CustomEvent) {
        const { event, visibility } = e.detail;
        const tag = event.tagReference();

        // check if we need to save an ephemeral key
        if (visibility === 'Delegated' && isNewSigner) {
            try {
                const listUser = await listSigner.user();
                currentUserPubkeys.push(listUser.hexpubkey());
                currentUserPubkeys = currentUserPubkeys;
                await saveEphemeralSigner($ndk, listSigner, {
                    associatedEvent: listEvent,
                    name: listEvent.encode(),
                    keyProfile: {
                        name: await getDelegatedSignerName(bookmarkList),
                        picture: $currentUser?.profile?.image,
                    }
                });
            } catch (e) {
                console.error(e);
                throw e;
            }
        }

        if (visibility === 'Delegated' || visibility === 'Public') {
            listEvent.tags.push(tag)
        } else if (visibility === 'Secret') {
            // if the current list has a content, decrypt it
            if (listEvent?.content) {
                let tags;

                try {
                    tags = JSON.parse(listEvent.content);
                } catch (e) {
                    console.error('trying to parse list content as JSON', e);
                    return;
                }

                if (!tags || !tags) tags = [];

                tags.push(tag);

                listEvent.content = JSON.stringify(tags);
            } else {
                listEvent.content = JSON.stringify([tag]);
            }

            await listEvent.encrypt($currentUser!);
        }

        listEvent.created_at = Math.floor(Date.now() / 1000);
        await listEvent.sign();
        await listEvent.publish();

        newItemType = undefined;
        addNewItemValue = '';
    }

    async function onRemoveItem(e: CustomEvent) {
        const { tag } = e.detail;
        const tagFilter = (t: NDKTag) => !(t[0] === tag[0] && t[1] === tag[1]);

        // Remove the tag from the list
        listEvent.tags = listEvent.tags.filter(tagFilter);

        listEvent.created_at = Math.floor(Date.now() / 1000);

        if (listEvent.content?.length > 0) {
            let tags;

            try {
                tags = JSON.parse(listEvent.content);
                if (!tags || !tags) tags = [];

                tags = tags.filter(tagFilter);

                listEvent.content = JSON.stringify(tags);
                await listEvent.encrypt($currentUser!);
            } catch (e) {
            }
        }

        await listEvent.sign();
        await listEvent.publish();
    }

    async function deleteBookmarkList() {
        if (!confirm("Are you sure you want to delete this list?")) {
            return;
        }

        await deleteList(listEvent);
    }

    let dropZoneActive = false;

    async function addToList(e: DragEvent) {
        console.log('add to list', e);
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        if (listEvent.tags.find(t => t[1] === id)) {
            alert('already has it');
            return;
        }

        listEvent.tags.push(tag);
        listEvent.created_at = Math.floor(Date.now() / 1000);
        await listEvent.sign();
        listEvent.publish();
    }
</script>

{#if listEvent && bookmarkList}
    <div class="flex flex-col gap-8">
        <div class="flex flex-row items-center justify-between">
            <!-- Header -->
            <div class="flex-1">
                <PageTitle
                    title={bookmarkList?.title||"Untitled"}
                    subtitle={bookmarkList?.description}
                />
            </div>

            <div class="flex flex-row items-center">
                <button
                    on:click={deleteBookmarkList}
                >
                    Delete
                </button>
            </div>
        </div>

        {#await decryptTags()}
            Loading
        {:then}
            <div class="-mt-8">
                <EphemeralKey
                    {listEvent}
                    bind:list={bookmarkList}
                    bind:signer={listSigner}
                    bind:signerUser={listSignerUser}
                    bind:isNewSigner
                />
            </div>

            <div class="grid grid-flow-row md:grid-cols-1 max-w-prose lg:sdgrid-cols-3 gap-2">
                <div class="relative flex flex-row items-center justify-center mb-8">
                    {#if newItemType === 'note'}
                        <div class="pb-4 w-full">
                            <NoteEditor
                                expandEditor={true}
                                delegatedSigner={listSigner}
                                {delegatedName}
                                bind:title={addNewItemValue}
                                on:keyup={onNewItemChange}
                                on:saved={onNoteEditorSaved}
                                bind:visibility={newItemVisibility}
                            />
                        </div>
                    {:else}
                        <div class="
                            px-4 py-2 text-lg
                            h-14
                            mb-12
                            shadow
                            w-full
                            border border-zinc-200
                            rounded-xl
                            bg-white transition duration-200 ease-in-out
                            flex flex-row gap-2
                        ">
                            <input autofocus bind:value={addNewItemValue} on:keyup={onNewItemChange} class="
                                w-full
                                focus:outline-none
                            " placeholder="Start typing" />

                            {#if showSaveButton}
                                <div class="flex flex-row gap-2">
                                    <NoteVisibility bind:value={newItemVisibility} />
                                    <button
                                        class="inline-flex items-center gap-x-2 rounded-md bg-gradient-to-br from-orange-500 to-red-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                                        px-4
                                    " on:click={save}>
                                        Save
                                    </button>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>

                {#if encryptedTags && encryptedTags.length > 0}
                    Secret (encrypted)
                    <Tags tags={encryptedTags} kind={4} {currentUserPubkeys} />
                {/if}

                <div
                    draggable={true}
                    on:dragenter={() => dropZoneActive = true}
                    on:dragleave={() => dropZoneActive = false}
                    on:drop={e => {addToList(e); dropZoneActive = false;}}
                    ondragover="return false"
                    class="
                        {dropZoneActive ? 'bg-zinc-300' : ''}
                        rounded-xl
                        transition duration-200 ease-in-out
                        p-2 py-8 -mx-6 px-6
                        flex flex-col gap-2.5
                    "
                >
                    <div class="font-semibold text-lg">Public</div>

                    <Tags tags={tags} {currentUserPubkeys} on:removeItem={onRemoveItem} />
                </div>

                {#if !isNewSigner && listSignerUser}
                    <div class="text-lg font-semibold">My Feed</div>

                    <FilterFeed filter={{
                        '#p': [listSignerUser.hexpubkey()],
                        'authors': [$currentUser.hexpubkey()]
                    }} />

                    <div class="text-lg font-semibold">Global Feed</div>

                    <FilterFeed filter={{
                        '#p': [listSignerUser.hexpubkey()],
                    }} />
                {/if}
            </div>
        {:catch e}
        error
            {e}
        {/await}
    </div>
{/if}