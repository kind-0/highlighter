<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';

    import ClickToAddComment from './ClickToAddComment.svelte';

    import ndk from '$lib/stores/ndk';
    import { NDKEvent, NDKUser, type NostrEvent } from '@nostr-dev-kit/ndk';
    import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';
    import { createEventDispatcher } from 'svelte';
    import type NDKHighlight from '$lib/ndk-kinds/highlight';
    import { Card, Input } from 'flowbite-svelte';
    import TopicInput from './TopicInput.svelte';

    export let highlight: NDKHighlight;
    export let topics: string[] = [];

    let highlightUser = new NDKUser({hexpubkey: highlight.pubkey});
    let saving = false;

    const dispatch = createEventDispatcher();

    function altTag(h: NDKEvent) {
        const content = `"${h.content}"\n\nThis is a highlight created on https://highlighter.com`;

        return ['alt', content];
    }

    function close() {
        dispatch('close');
    }

    async function save() {
        saving = true;
        highlight.content = highlight.content;

        // Add tags
        for (const topic of topics) {
            highlight.tags.push(['t', topic]);
        }

        // NIP-31
        highlight.tags.push(altTag(highlight));

        await highlight.publish();

        if (comment) {
            const commentEvent = new NDKEvent($ndk, {
                kind: 1,
                content: `nostr:${highlight.encode()}\n${comment}`,
                tags: [
                    ['q', highlight.tagId(), 'quote'],
                    ['k', highlight.kind]
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
    <Card size="xl" class="
        overflow-hidden rounded-md
        bg-orange-50
        flex flex-col h-full gap-2
        transition duration-100
        group
    " style="max-height: 40rem;">
        <!-- Content -->
        <div class="
            leading-relaxed h-full
            px-6 py-4
            my-2
            border-l-4 border-orange-500
            overflow-auto
        ">
            {@html contextWithHighlight}
        </div>

        <!-- Comment -->
        <ClickToAddComment bind:value={comment} />

        <!-- Footer -->
        <div class="
            flex flex-row
            gap-8
            items-center
            justify-between
            w-full
            rounded-b-lg
            py-4 pb-0
        ">
            <div class="flex flex-row gap-4 items-center whitespace-nowrap">
                <TopicInput
                    bind:values={topics}
                />
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
    </Card>
</div>