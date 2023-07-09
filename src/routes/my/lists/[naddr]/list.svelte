<script lang="ts">
    import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Helper, Tooltip } from 'flowbite-svelte';

    import DeleteIcon from '$lib/icons/Trash.svelte';
    import MoreOptionsIcon from '$lib/icons/MoreOptions.svelte';

    import { currentUser } from '$lib/store';
    import ndk from '$lib/stores/ndk';

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
    import { getLists, processEvent } from '$lib/stores/list';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import Button from '$lib/components/buttons/Button.svelte';
    import CopyButton from '$lib/components/buttons/CopyButton.svelte';
    import { writable } from 'svelte/store';

    export let list: NDKList;
    let listId;

    let publicTags: NDKTag[] = [];

    let listSignerData: SignerStoreItem | undefined;

    let visibility = 'Delegated';
    let beforeSecretVisibility = visibility;

    if (list.id !== listId) {
        listId = list.id;
        publicTags = list.tags;
    }

    /**
     * Establishes what pubkeys are going to be treated as
     * "current user"'s pubkeys
     */
    let currentUserPubkeys: string[] = [];

    if ($currentUser) {
        currentUserPubkeys.push($currentUser.hexpubkey());
    }

    $: if (listSignerData?.user && !currentUserPubkeys.includes(listSignerData.user.hexpubkey())) {
        currentUserPubkeys.push(listSignerData.user.hexpubkey());
    }

    async function deleteList() {
        if (!confirm('Are you sure you want to delete this list?')) {
            return;
        }

        await list.encrypt($currentUser!);
        await list.delete();
        if ($currentUser) {
            getLists($currentUser);
        }
        goto('/my/lists');
    }

    let dropZoneActive = false;

    async function onDragEnter(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        // set dropZoneActive if none of the tags have this id
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        dropZoneActive = !list.tags.find((t) => t[1] === id);
    }

    async function addToList(e: DragEvent) {
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        if (list.tags.find((t) => t[1] === id)) {
            return;
        }

        list.tags.push(tag);
        list.created_at = Math.floor(Date.now() / 1000);
        await list.sign();
        list.publish();

        processEvent(list);
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
                    keyProfile: {
                        name: listSignerData.name,
                        picture: $currentUser?.profile?.image,
                        lud06: $currentUser?.profile?.lud06,
                        lud16: $currentUser?.profile?.lud16,
                    },
                });
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }

    let fetchingSigner = false;

    $: if (list && listSignerData?.id !== list.encode() && !fetchingSigner) {
        fetchingSigner = true;
        listSignerData = undefined;
        getSigner(list)
            .then((d) => {
                listSignerData = d;
                fetchingSigner = false;
            })
            .catch((e) => {
                console.error(e);
                listSignerData = undefined;
                fetchingSigner = false;
            });
    }

    const encryptedTags = writable<NDKTag[]>([]);
    let encryptedTagsTimestamp: number;

    $: if (list.created_at !== encryptedTagsTimestamp) {
        encryptedTagsTimestamp = list.created_at!;
        list.encryptedTags().then((tags) => {
            encryptedTags.set(tags);
        });
    }
</script>

<svelte:head>
    <title>{list.name}</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-8 max-w-prose">
    <div class="lg:border-b border-gray-200 lg:pb-5 flex flex-row gap-4 items-start">
        <PageTitle
            title={list.name??"Untitled List"}
            subtitle={list.description}
        >
            <div class="flex flex-row items-center gap-4">
                <Button class="w-10 h-10 !px-2">
                    <MoreOptionsIcon />
                </Button>
                <Dropdown class="z-10">
                    {#if listSignerData?.saved}
                        <CopyButton class="" data={listSignerData.user.npub} label="Copy lists' npub" comp={DropdownItem}>
                            <Helper class="text-xs opacity-80 ml-6 mt-1 font-normal w-56">
                                You can tag this list in any note to make those notes appear in its feed.
                            </Helper>
                        </CopyButton>
                    {/if}

                    <CopyButton class="flex flex-row items-center gap-2" data={list.encode()} comp={DropdownItem} label="Copy List ID" />

                    <CopyButton class="flex flex-row items-center gap-2" data={list.rawEvent()} comp={DropdownItem} label="Copy List JSON" />

                    <DropdownDivider />

                    <DropdownItem class="flex flex-row items-center gap-2" on:click={deleteList}>
                        <DeleteIcon class="w-4 h-4" />
                        Delete List
                    </DropdownItem>
                </Dropdown>
            </div>
        </PageTitle>
    </div>

    <div class="flex flex-col sm:max-w-3xl gap-2 w-full">
        {#if list instanceof NDKRelayList}
            <AddRelayListItem {list} />
        {:else if listSignerData}
            <AddListItem
                {list}
                bind:visibility
                delegatedName={listSignerData.name}
                listSigner={listSignerData.signer}
                listSignerUser={listSignerData.user}
                on:saved={onNoteEditorSaved}
            />
        {:else}
            <AddListItem {list} on:saved={onNoteEditorSaved} />
        {/if}

        <Tabs
            class="items-center mt-4"
            activeClasses='px-2 py-2 lg:px-6 lg:py-4 text-zinc-600 bg-orange-900/10 rounded-lg'
            inactiveClasses='px-2 py-2 lg:px-6 lg:py-4 text-zinc-600 rounded-lg'
            divider={false}
        >
            <TabItem
                open
                title="Public"
                on:focus={() => { visibility = beforeSecretVisibility; }}
            >
                <div
                    on:dragenter={onDragEnter}
                    on:dragleave={() => (dropZoneActive = false)}
                    on:drop={(e) => {
                        addToList(e);
                        dropZoneActive = false;
                    }}
                    ondragover="return false"
                    class="
                        {dropZoneActive ? 'bg-zinc-300' : ''}
                        rounded-xl
                        transition duration-200 ease-in-out
                        p-2 py-2 -mx-6
                    "
                >
                    <Tags {list} tags={list.tags} {currentUserPubkeys} />
                </div>
            </TabItem>

            <TabItem
                title="Secret"
                on:focus={() => { beforeSecretVisibility = visibility; visibility = 'Secret'; }}
            >
                <Tags {list} tags={$encryptedTags} {currentUserPubkeys} encrypted={true} />
            </TabItem>

            {#if listSignerData?.saved && $currentUser}
                <TabItem title={`My Feed ${myFeedLength > 0 ? `(${myFeedLength})` : ''}`}>
                    {#if myFeedLength === 0}
                        <div
                            class="
                            flex flex-col gap-4
                            bg-orange-500/10
                            border-1 border-orange-500
                            rounded-xl
                            mb-4 p-4
                        "
                        >
                            <p>
                                This tab shows mentions <em>you</em> have done of this list's account
                                <AvatarWithName pubkey={listSignerData.user.hexpubkey()} />
                            </p>

                            <p>You can use this feature to mention things you would like to have show up in this feed.</p>
                        </div>
                    {/if}
                    <FilterFeed
                        filter={{
                            kinds: [1, 9802, 4, 30023],
                            '#p': [listSignerData.user.hexpubkey()],
                            authors: [$currentUser.hexpubkey()],
                        }}
                        bind:feedLength={myFeedLength}
                    />
                </TabItem>

                <TabItem title={`Global Feed ${globalFeedLength > 0 ? `(${globalFeedLength})` : ''}`}>
                    {#if globalFeedLength === 0}
                        <div
                            class="
                            flex flex-col gap-4
                            bg-orange-500/10
                            border-1 border-orange-500
                            rounded-xl
                            mb-4 p-4
                        "
                        >
                            <p>
                                This tab shows <b>all</b> mentions of this list's account
                                <AvatarWithName pubkey={listSignerData.user.hexpubkey()} size="xs" />
                            </p>

                            <p>You can use this feature to allow other people to suggest you to add things to this list.</p>
                        </div>
                    {/if}
                    <FilterFeed
                        filter={{
                            kinds: [1, 9802, 4, 30023],
                            '#p': [listSignerData.user.hexpubkey()],
                        }}
                        bind:feedLength={globalFeedLength}
                        eventFilter={(e) => e.pubkey !== $currentUser.hexpubkey()}
                    />
                </TabItem>
            {/if}

            <TabItem title="Similar Lists' Feed">
                <ListsFeed name={list.name} />
            </TabItem>
        </Tabs>
    </div>
</div>
