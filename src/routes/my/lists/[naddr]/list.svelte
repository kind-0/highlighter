<script lang="ts">
    import Trash from '$lib/icons/Trash.svelte';

    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";
    import BookmarkListInterface, { deleteList } from '$lib/interfaces/bookmark-list';

    import PageTitle from '../../components/PageTitle.svelte';
    import { Tabs, TabItem } from 'flowbite-svelte';

    import Tags from './tags.svelte';
    import type { NDKTag, NostrEvent } from '@nostr-dev-kit/ndk/lib/src/events';
    import FilterFeed from '$lib/components/FilterFeed.svelte';
    import { goto } from '$app/navigation';
    import AddListItem from '$lib/components/lists/AddListItem.svelte';
    import type NDKList from '$lib/ndk-kinds/lists';
    import AddRelayListItem from '$lib/components/lists/AddRelayListItem.svelte';
    import NDKRelayList from '$lib/ndk-kinds/lists/relay-list';
    import ListsFeed from './ListsFeed.svelte';
    import AvatarWithName from '$lib/components/AvatarWithName.svelte';
    import listSigners, { getSigner, type SignerStoreItem } from '$lib/stores/signer';
    import { saveEphemeralSigner } from '$lib/signers/ephemeral';

    export let list: NDKList;
    let listId;

    let encryptedTags: NDKTag[] = [];
    let publicTags: NDKTag[] = [];

    let encryptedTagsPromise: Promise<NDKTag[]>;

    let listSignerData: SignerStoreItem | undefined;

    if (list.id !== listId) {
        listId = list.id;
        publicTags = list.tags;

        encryptedTagsPromise = new Promise(async (resolve) => {
            encryptedTags = await list.encryptedTags();
            resolve(encryptedTags);
        });
    }

    /**
     * Establishes what pubkeys are going to be treated as
     * "current user"'s pubkeys
     */
    let currentUserPubkeys: string[] = [];

    $: if (listSignerData?.user && !currentUserPubkeys.includes(listSignerData.user.hexpubkey())) {
        currentUserPubkeys.push(listSignerData.user.hexpubkey());
    }

    async function deleteBookmarkList() {
        if (!confirm("Are you sure you want to delete this list?")) {
            return;
        }

        await deleteList(list);
        goto('/my/lists');
    }

    let dropZoneActive = false;

    async function onDragEnter(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        // set dropZoneActive if none of the tags have this id
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        dropZoneActive = !list.tags.find(t => t[1] === id);
    }

    async function addToList(e: DragEvent) {
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        if (list.tags.find(t => t[1] === id)) {
            alert('already has it');
            return;
        }

        list.tags.push(tag);
        list.created_at = Math.floor(Date.now() / 1000);
        await list.sign();
        list.publish();
    }

    let myFeedLength: number;
    let globalFeedLength: number;

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
        if (visibility === 'Delegated' && !listSignerData?.saved) {
            if (!listSignerData?.signer) {
                alert('no signer found');
                return;
            }

            try {
                await saveEphemeralSigner($ndk, listSignerData.signer, {
                    associatedEvent: list,
                    name: list.encode(),
                    keyProfile: {
                        name: listSignerData.name,
                        picture: $currentUser?.profile?.image,
                    }
                });
            } catch (e) {
                console.error(e);
                throw e;
            }
        }

        if (visibility === 'Delegated' || visibility === 'Public') {
            list.tags.push(tag)
        } else if (visibility === 'Secret') {
            // if the current list has a content, decrypt it
            if (list?.content) {
                let tags;

                try {
                    tags = JSON.parse(list.content);
                } catch (e) {
                    console.error('trying to parse list content as JSON', e);
                    return;
                }

                if (!tags || !tags) tags = [];

                tags.push(tag);

                list.content = JSON.stringify(tags);
            } else {
                list.content = JSON.stringify([tag]);
            }

            await list.encrypt($currentUser!);
        }

        list.created_at = Math.floor(Date.now() / 1000);
        await list.sign();
        await list.publish();
    }

    $: if (list && listSignerData?.id !== list.encode()) {
        listSignerData = undefined;
        getSigner(list).then(d => listSignerData = d);
    }

</script>

<svelte:head>
    <title>{list.name}</title>
</svelte:head>

<div class="flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between">
        <!-- Header -->
        <div class="flex-1">
            <PageTitle title={list.name || "List"} subtitle={list.description} />
        </div>

        <div class="flex flex-row items-center">
            <button
                on:click={deleteBookmarkList}
                class="w-6 h-6 opacity-50 hover:opacity-100 duration-300"
            ><Trash /></button>
        </div>
    </div>

    <div class="-mt-8">
        {#if listSignerData?.saved}
            <AvatarWithName pubkey={listSignerData.user.hexpubkey()}>
                <div slot="bio">
                    {listSignerData.user.npub}
                </div>
            </AvatarWithName>
        {/if}
    </div>

    <div class="grid grid-flow-row md:grid-cols-1 sm:max-w-prose lg:sdgrid-cols-3 gap-2 w-full">
        {#if list instanceof NDKRelayList}
            <AddRelayListItem {list} />
        {:else if listSignerData}
            <AddListItem
                list={list}
                delegatedName={listSignerData.name}
                listSigner={listSignerData.signer}
                listSignerUser={listSignerData.user}
                on:saved={onNoteEditorSaved}
            />
        {:else}
            <AddListItem
                list={list}
                on:saved={onNoteEditorSaved}
            />
        {/if}

        <Tabs style="underline">
            <TabItem open title="Public">
                <div
                    on:dragenter={onDragEnter}
                    on:dragleave={() => dropZoneActive = false}
                    on:drop={e => {addToList(e); dropZoneActive = false;}}
                    ondragover="return false"
                    class="
                        {dropZoneActive ? 'bg-zinc-300' : ''}
                        rounded-xl
                        transition duration-200 ease-in-out
                        p-2 py-2 -mx-6 px-6
                    "
                >
                    <Tags {list} tags={list.tags} {currentUserPubkeys} />
                </div>
            </TabItem>

            {#await encryptedTagsPromise then encryptedTags}
                {#if encryptedTags.length > 0}
                    <TabItem title="Secret">
                        <Tags {list} tags={encryptedTags} kind={4} {currentUserPubkeys} />
                    </TabItem>
                {/if}
            {/await}

            {#if listSignerData?.saved && $currentUser}
                <TabItem title={`My Feed ${myFeedLength > 0 ? `(${myFeedLength})` : ''}`}>
                    {#if myFeedLength === 0}
                        <div class="
                            flex flex-col gap-4
                            bg-orange-500/10
                            border-1 border-orange-500
                            rounded-xl
                            mb-4 p-4
                        ">
                            <p>
                                This tab shows mentions <em>you</em> have done of this list's account
                                <AvatarWithName pubkey={listSignerData.user.hexpubkey()} size='xs' />
                            </p>

                            <p>
                                You can use this feature to mention things you would like to have
                                show up in this feed.
                            </p>
                        </div>
                    {/if}
                    <FilterFeed filter={{
                        kinds: [1, 9802, 4, 30023],
                        '#p': [listSignerData.user.hexpubkey()],
                        'authors': [$currentUser.hexpubkey()]
                    }} bind:feedLength={myFeedLength} />
                </TabItem>

                <TabItem title={`Global Feed ${globalFeedLength > 0 ? `(${globalFeedLength})` : ''}`}>
                    {#if globalFeedLength === 0}
                        <div class="
                            flex flex-col gap-4
                            bg-orange-500/10
                            border-1 border-orange-500
                            rounded-xl
                            mb-4 p-4
                        ">
                            <p>
                                This tab shows <b>all</b> mentions of this list's account
                                <AvatarWithName pubkey={listSignerData.user.hexpubkey()} size='xs' />
                            </p>

                            <p>
                                You can use this feature to allow other people to suggest you
                                to add things to this list.
                            </p>
                        </div>
                    {/if}
                    <FilterFeed filter={{
                        kinds: [1, 9802, 4, 30023],
                        '#p': [listSignerData.user.hexpubkey()]
                    }} bind:feedLength={globalFeedLength} />
                </TabItem>
            {/if}

            <TabItem title="Similar Lists' Feed">
                <ListsFeed name={list.name} />
            </TabItem>
        </Tabs>
    </div>
</div>