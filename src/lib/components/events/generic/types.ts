import { NDKKind } from "$lib/ndk-kinds";
import type { NDKEvent } from "@nostr-dev-kit/ndk";

export function isMarginNote(event: NDKEvent) {
    const isKind1 = event.kind === 1;
    const hasQTag = event.tagValue('q') !== undefined;
    // const hasKTag = event.tagValue('k') === NDKKind.Highlight.toString();

    return isKind1 && hasQTag;
}