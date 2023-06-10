<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import type { NDKPrivateKeySigner, NDKUser, NDKTag } from "@nostr-dev-kit/ndk";
    import { nip19 } from "nostr-tools";
    import NoteEditor from "../../../routes/my/components/note-editor.svelte";
    import NoteVisibility from "../../../routes/my/components/note/visibility.svelte";
    import NDKRelayList from "$lib/ndk-kinds/lists/relay-list";
    import { createEventDispatcher } from 'svelte';

    export let list: NDKList;
    export let delegatedName: string | undefined = undefined;
    export let listSigner: NDKPrivateKeySigner | undefined = undefined;
    export let listSignerUser: NDKUser | undefined = undefined;

    const dispatch = createEventDispatcher();
    let addNewItemValue = '';
    let newItemType: string | undefined;
    let showSaveButton = false;
    let newItemVisibility = 'Delegated';
    let validationError: string | undefined;

    function onNewItemChange() {
        const validation = list.validateTag(addNewItemValue);

        if (validation !== true) {
            validationError = validation as string;
            return;
        } else {
            validationError = undefined;
        }

        if (list instanceof NDKRelayList) {
            return;
        }

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

    async function save() {
        if (!addNewItemValue || addNewItemValue.length === 0) {
            return;
        }

        let tag: NDKTag = [];

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

        list.created_at = Math.floor(Date.now() / 1000);
        list.tags.push(tag);
        await list.sign();
        await list.publish();
        addNewItemValue = '';
    }

    function onNewItemSaved(e: CustomEvent) {
        newItemType = undefined;
        addNewItemValue = '';

        dispatch('saved', e.detail);
    }
</script>

<div class="relative flex flex-row items-center justify-center">
    {#if newItemType === 'note'}
        <div class="pb-4 w-full">
            <NoteEditor
                expandEditor={true}
                {delegatedName}
                delegatedSigner={listSigner}
                delegatedUser={listSignerUser}
                bind:title={addNewItemValue}
                on:keyup={onNewItemChange}
                on:saved={onNewItemSaved}
                bind:visibility={newItemVisibility}
            />
        </div>
    {:else}
        <div class="
            px-4 py-2 text-lg
            h-14
            sm:mb-4
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

        {#if validationError}
            <div class="text-red-500 text-sm mt-2">
                {validationError}
            </div>
        {/if}
    {/if}
</div>
