import { get as getStore } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

export default async function rejectEvent(event: NDKEvent, reason?: string): Promise<NDKEvent> {
    const $ndk = getStore(ndk)
    const rejectEvent = new NDKEvent($ndk, {
        kind: 7,
        content: reason ?? "👎",
        tags: [
            [ 'feedback', 'rejected' ],
        ]
    } as NostrEvent);
    rejectEvent.tag(event);
    await rejectEvent.publish();

    return rejectEvent;
}