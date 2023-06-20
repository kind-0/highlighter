    <script lang="ts">
    import type NDKList from "$lib/ndk-kinds/lists";
    import { NDKPrivateKeySigner, NDKUser, type NDKTag, NDKRelay } from "@nostr-dev-kit/ndk";
    import { nip19 } from "nostr-tools";

    export let list: NDKList;

    let value = '';
    let showSaveButton = false;
    let validationError: string | undefined;

    function onNewItemChange() {
        if (value.length === 0) {
            showSaveButton = false;
            validationError = undefined;
            return;
        }

        const validation = list.validateTag(value);

        if (validation !== true) {
            validationError = validation as string;
            return;
        } else {
            validationError = undefined;
            showSaveButton = true;
        }
    }

    async function save() {
        list.created_at = Math.floor(Date.now() / 1000);
        const relay = new NDKRelay(value);
        list.addItem(relay);
        await list.sign();
        await list.publish();
        value = '';
    }
</script>

<div class="relative flex flex-row items-center justify-center">
    <div class="
        px-4 py-2 text-lg
        h-14
        sm:mb-12
        shadow
        w-full
        border border-zinc-200
        rounded-xl
        bg-white transition duration-200 ease-in-out
        flex flex-row gap-2
    ">
        <input autofocus bind:value={value} on:keyup={onNewItemChange} class="
            w-full
            focus:outline-none
        " placeholder="Start typing" />

        {#if showSaveButton}
            <div class="flex flex-row gap-2">
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
</div>
