<script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import { type NDKPrivateKeySigner, type NDKUser, type NDKTag, NDKEvent, type NostrEvent, type NDKSigner, NDKKind } from "@nostr-dev-kit/ndk";
    import { nip19 } from "nostr-tools";
    import ndk from "$lib/stores/ndk";
    import EventVisibility from '$lib/components/events/editor/EventVisibility.svelte';
    import { createEventDispatcher } from 'svelte';
    import Button from '$lib/components/buttons/Button.svelte';
    import EventEditorTextarea from "../events/editor/EventEditorTextarea.svelte";

    export let list: NDKList;
    export let delegatedName: string | undefined = undefined;
    export let listSigner: NDKPrivateKeySigner | undefined = undefined;
    export let listSignerUser: NDKUser | undefined = undefined;

    const dispatch = createEventDispatcher();
    let value = '';
    export let visibility = 'Delegated';
    let validationError: string | undefined;

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
</script>


<div class="flex flex-col items-start justify-center">
    <EventEditorTextarea bind:value />

    {#if validationError}
        <div class="text-red-500 text-sm mt-2">
            {validationError}
        </div>
    {/if}
</div>

<div class="self-end join">
    <EventVisibility
        {delegatedName}
        delegatedUser={listSignerUser}
        bind:value={visibility}
        class="join-item"
    />

    <div>
        <button class="btn join-item btn-primary px-14" on:click={save}>
            Save
        </button>
    </div>
</div>