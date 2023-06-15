<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import { type NDKPrivateKeySigner, type NDKUser, type NDKTag, NDKEvent, type NostrEvent, type NDKSigner, NDKKind } from "@nostr-dev-kit/ndk";
    import { nip19 } from "nostr-tools";
    import ndk from "$lib/stores/ndk";
    import EventVisibility from '$lib/components/events/editor/EventVisibility.svelte';
    import NDKRelayList from "$lib/ndk-kinds/lists/relay-list";
    import { createEventDispatcher } from 'svelte';
    import RoundedButton from "../../../routes/(main)/components/RoundedButton.svelte";
    import EventEditorTextarea from "../events/editor/EventEditorTextarea.svelte";

    export let list: NDKList;
    export let delegatedName: string | undefined = undefined;
    export let listSigner: NDKPrivateKeySigner | undefined = undefined;
    export let listSignerUser: NDKUser | undefined = undefined;

    const dispatch = createEventDispatcher();
    let value = '';
    let newItemType: string | undefined;
    let showSaveButton = false;
    let visibility = 'Delegated';
    let validationError: string | undefined;

    function onNewItemChange() {
        console.log(`change`)
        if (value.length === 0) {
            showSaveButton = false;
            newItemType = undefined;
            visibility = 'Delegated';
            return;
        }

        const validation = list.validateTag(value);

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
            if (value.startsWith(pattern.slice(0, value.length))) {
                isNotMatching = false;
                break;
            }
        }

        if (value.match(/ /) || isNotMatching) {
            newItemType = 'note'
        } else {
            newItemType = undefined;
        }

        if (newItemType !== 'note' && value.length > 3) {
            showSaveButton = true;
            visibility = 'Public';
        }
    }

    function getKind(): NDKKind {
        switch (visibility) {
            case 'Public':
            case 'Delegated':
                return 1;
            case 'Secret':
                return 4;
        }

        return 1;
    }

    function getSigner(): NDKSigner {
        if (visibility === 'Delegated') {
            return listSigner!;
        }

        return $ndk.signer!;
    }

    async function generateEvent(): Promise<NDKTag | undefined> {
        let event: NDKEvent;
        let _value = value.trim();

        // if this a relay URL, nrelay-encode it
        if (_value.startsWith('wss://')) {
            _value = nip19.nrelayEncode(_value);
        }

        try {
            const decode = nip19.decode(_value);

            switch (decode.type) {
                case 'naddr':
                case 'note':
                case 'nevent':
                    // We were able to decode something that looks like an event
                    // fetch it
                    const _event = await $ndk.fetchEvent(_value);
                    if (_event) {
                        // we were able to fetch it, let's return it
                        return _event.tagReference();
                    } else {
                        // TODO: Generate a NDKTag based on the values
                        return undefined;
                    }
                case "nrelay":
                    return ['r', decode.data as string];
                case "npub":
                    return ['p', decode.data as string];
                case "nprofile":
                    const d = ['p', decode.data.pubkey];
                    if (decode.data.relays && decode.data.relays[0]) d.push(decode.data.relays[0]);
                    return d;
            }

        } catch (e) {
            const signer = getSigner();
            const user = await signer.user();
            event = new NDKEvent($ndk, {
                content: _value || "",
                kind: getKind(),
                tags: [ ['client', 'highlighter'] ],
                pubkey: user.hexpubkey(),
            } as NostrEvent);

            if (visibility === 'Secret') {
                event.tag(user);
                await event.encrypt(user, signer);
            }

            await event.sign(signer);

            await event.publish();

            return event.tagReference();
        }
    }

    async function save() {
        const tag = await generateEvent();

        if (!tag) return;

        await list.addItem(tag, undefined, visibility === 'Secret');
        await list.sign();
        await list.publish();

        dispatch('saved', { tag, visibility });

        value = '';
    }

    async function _save() {
        if (!value || value.length === 0) {
            return;
        }

        let tag: NDKTag = [];

        const decode = nip19.decode(value);
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

        await list.addItem(tag, undefined, visibility === 'Secret');
        await list.sign();
        await list.publish();
        value = '';
    }
</script>


<div class="relative flex flex-col items-start justify-center">
        <EventEditorTextarea bind:value />

        {#if validationError}
            <div class="text-red-500 text-sm mt-2">
                {validationError}
            </div>
        {/if}
</div>

<div class="flex flex-row justify-between">
    <EventVisibility
        {delegatedName}
        delegatedUser={listSignerUser}
        bind:value={visibility}
    />

    <div>
        <RoundedButton on:click={save}>
            Save
        </RoundedButton>
    </div>
</div>