<script lang="ts">
    import { Dropdown, DropdownItem } from 'flowbite-svelte'

    import DeleteIcon from '$lib/icons/Trash.svelte';
    import MoreOptionsIcon from '$lib/icons/MoreOptions.svelte';
    import CopyIcon from '$lib/icons/Copy.svelte';

    import { currentUser } from '$lib/store';
    import ndk from "$lib/stores/ndk";

    import PageTitle from '../../components/PageTitle.svelte';
    import { Tabs, TabItem } from 'flowbite-svelte';

    import Tags from './tags.svelte';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import FilterFeed from '$lib/components/FilterFeed.svelte';
    import { goto } from '$app/navigation';
    import AddListItem from '$lib/components/lists/AddListItem.svelte';
    import type NDKList from '$lib/ndk-kinds/lists';
    import AddRelayListItem from '$lib/components/lists/AddRelayListItem.svelte';
    import NDKRelayList from '$lib/ndk-kinds/lists/relay-list';
    import ListsFeed from './ListsFeed.svelte';
    import AvatarWithName from '$lib/components/AvatarWithName.svelte';
    import { getSigner, type SignerStoreItem } from '$lib/stores/signer';
    import { saveEphemeralSigner } from '$lib/signers/ephemeral';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';

    export let list: NDKList;
    let listId;

    let publicTags: NDKTag[] = [];

    let listSignerData: SignerStoreItem | undefined;

    if (list.id !== listId) {
        listId = list.id;
        publicTags = list.tags;
    }

    /**
     * Establishes what pubkeys are going to be treated as
     * "current user"'s pubkeys
     */
    let currentUserPubkeys: string[] = [];

    $: if (listSignerData?.user && !currentUserPubkeys.includes(listSignerData.user.hexpubkey())) {
        currentUserPubkeys.push(listSignerData.user.hexpubkey());
    }

    async function deleteList() {
        if (!confirm("Are you sure you want to delete this list?")) {
            return;
        }

        await list.encrypt();
        await list.delete();
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
        const { tag, visibility } = e.detail;

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
    }

    $: if (list && listSignerData?.id !== list.encode()) {
        listSignerData = undefined;
        getSigner(list).then(d => listSignerData = d).catch(e => {
            console.error(e);
            listSignerData = undefined;
        });
    }

    let copiedEventJSON = false;

    function copyJSON(e: Event) {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(list.rawEvent()));
        copiedEventJSON = true;
        setTimeout(() => {
            copiedEventJSON = false;
        }, 1500);
    }

    async function tryToDecrypt(): Promise<NDKTag[]> {
        console.log(`will try to decrypt ${list.content}`);
        const tags = await list.encryptedTags();
        console.log(`decrypted ${list.content}`);
        return tags;
    }

    let encryptedTagsPromise: Promise<NDKTag[]> | undefined;

    $: if (list && $currentUser && !encryptedTagsPromise) {
        encryptedTagsPromise = new Promise(async (resolve, reject) => {
            try {
                const tags = await tryToDecrypt();
                console.log(`decrypted tags`, tags)
                resolve(tags);
            } catch (e) {
                setTimeout(() => { tryToDecrypt() }, 100 * Math.random());
            }
        });
    }
</script>

<svelte:head>
    <title>{list.name}</title>
</svelte:head>

<div class="flex flex-col gap-8">
    <div class="border-b border-gray-200 pb-5 flex flex-row gap-4 items-start">
        <div class="flex flex-row items-start">
            <button on:click|stopPropagation={() => {}}>
                <MoreOptionsIcon class="
                    border shadow rounded-full
                    bg-white
                    p-2
                    w-10 h-10
                    transition-opacity duration-200
                " />
            </button>
            <Dropdown>
                <DropdownItem class="flex flex-row items-center gap-2" on:click={deleteList}>
                    <DeleteIcon class="w-4 h-4" />
                    Delete List
                </DropdownItem>

                <DropdownItem class="flex flex-row items-center gap-2" on:click={copyJSON}>
                    <CopyIcon class="w-4 h-4" />
                    {copiedEventJSON ? 'Copied!' : 'Copy Event JSON'}
                </DropdownItem>
            </Dropdown>
        </div>
        <div class="flex flex-col">
            <div class="-ml-2 -mt-2 flex flex-wrap items-baseline">
                <h3 class="ml-2 mt-2 text-3xl font-semibold leading-6 text-gray-900">
                    {list.name}
                </h3>
                <p class="ml-2 mt-1 truncate text-base text-gray-500">
                    {list.description??""}
                </p>
            </div>

            <div class="flex flex-row gap-8 text-xs text-zinc-400">
                {#if listSignerData?.saved}
                    {listSignerData.user.npub}
                {/if}
            </div>
        </div>
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

            {#await encryptedTagsPromise}
                Loading
            {:then encryptedTags}
                {#if encryptedTags.length > 0}
                    <TabItem title="Secret">
                        <Tags {list} tags={encryptedTags} {currentUserPubkeys} />
                    </TabItem>
                {/if}
            {:catch e}
                {e}
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
