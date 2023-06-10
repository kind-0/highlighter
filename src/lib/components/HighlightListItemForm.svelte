<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';

    import ClickToAddComment from './ClickToAddComment.svelte';

    import ndk from '$lib/stores/ndk';
    import { NDKEvent, NDKUser, type NostrEvent } from '@nostr-dev-kit/ndk';
    import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';
    import { createEventDispatcher } from 'svelte';
    import NDKHighlight from '$lib/ndk-kinds/highlight';


    export let highlight: App.Highlight;
    export let disableClick: boolean = false;
    export let articleEvent: NDKEvent | undefined = undefined;

    let articleLink: string;
    let highlightUser = new NDKUser({hexpubkey: highlight.pubkey});
    let saving = false;

    const dispatch = createEventDispatcher();

    function altTag(event: NDKEvent) {
        const content = `"${event.content}"\n\nThis is a highlight created on https://highlighter.com`;

        return ['alt', content];
    }

    function close() {
        dispatch('close');
    }

    async function save() {
        saving = true;
        const event = new NDKHighlight($ndk);
        event.content = highlight.content;

        if (articleEvent) {
            event.article = articleEvent;
        } else if (highlight.url) {
            event.article = highlight.url;
        }

        // NIP-31
        event.tags.push(altTag(event));

        await event.publish();

        if (comment) {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: `nostr:${event.encode()}\n${comment}`,
                tags: [
                    ['q', event.tagId(), 'quote']
                ]
            } as NostrEvent)
            await commentEvent.publish();
        }

        dispatch('close');
    }

    let contextWithHighlight = '';

    $: {
        if (highlight.context) {
            contextWithHighlight = highlight.context.replace(highlight.content, `<mark>${highlight.content}</mark>`);
        } else {
            contextWithHighlight = `<mark>${highlight.content}</mark>`;
        }
    }

    let comment = '';
</script>

<div class="flex flex-col gap-4">
    <div class="
        overflow-hidden rounded-md bg-white px-6 py-4 shadow
        flex flex-col h-full gap-2
        transition duration-100
        group
    " style="max-height: 40rem;">
        <!-- Content -->
        <div class="
            leading-relaxed h-full
            px-6 py-4
            my-2
            border-l border-slate-500
            overflow-auto
        ">
            {@html contextWithHighlight}
        </div>

        <!-- Comment -->
        <ClickToAddComment bind:value={comment} />

        <!-- Footer -->
        <div class="
            flex flex-row
            items-center
            justify-between
            w-full
            rounded-b-lg
            py-4 pb-0
        ">
            <div class="flex flex-row gap-4 items-center whitespace-nowrap">
                <a
                    href="/p/{highlightUser.npub}"
                    class="flex flex-row gap-4 items-center justify-center">
                    <Avatar pubkey={highlight.pubkey} klass="h-6" />
                    <div class=" text-gray-500 text-xs hidden sm:block">
                        <Name pubkey={highlight.pubkey} />
                    </div>
                </a>
            </div>

            <div class="
                flex flex-row gap-4 items-center
            ">
                <!-- Cancel Button -->
                <button class="text-gray-500 text" on:click={close}>
                    Cancel
                </button>

                <!-- Save Button -->
                <RoundedButton on:click={save} disabled={saving}>Save</RoundedButton>
            </div>
        </div>
    </div>
</div>