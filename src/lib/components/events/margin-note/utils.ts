import { get as getStore } from "svelte/store";
import NDKHighlight from "$lib/ndk-kinds/highlight";
import ndk from "$lib/stores/ndk";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from 'nostr-tools';

export function removeQuotedEvent(event: NDKEvent) {
    const quotedEventId = event.tagValue('q');

    if (!quotedEventId) return event.content;

    const content = event.content;
    const bech32 = nip19.noteEncode(quotedEventId);

    const match = new RegExp(`nostr:${bech32}`);
    return content.replace(match, '');
}

export async function fetchQuotedHighlight(event: NDKEvent): Promise<NDKHighlight | null> {
    const $ndk = getStore(ndk);
    const taggedHighlightId = event.tagValue('q');

    if (taggedHighlightId) {
        return new Promise((resolve) => {
            $ndk.fetchEvent(taggedHighlightId).then((e) => {
                if (e) resolve(NDKHighlight.from(e));
            }).catch((e) => {
                console.error(e);
                resolve(null);
            });
        });
    }

    return null;
}