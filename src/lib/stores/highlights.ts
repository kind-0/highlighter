import { NDKKind } from "../ndk-kinds";
import { type NDKFilter, NDKSubscriptionCacheUsage, NDKEvent, type NDKTag, NDKSubscription } from "@nostr-dev-kit/ndk";
import NDKHighlight from "../ndk-kinds/highlight";
import { writable, derived, get as getStore } from 'svelte/store';
import ndk from './ndk';

type ArticleId = NDKTag;

/**
 * Highlights are stored in a Set, which is a collection of unique values.
 *
 * The highlights are time ordered, so the last one is the most recent.
 */
export const highlights = writable<NDKHighlight[]>([]);

/**
 * Highlights grouped by article id.
 */
export const articleHighlights = derived(highlights, ($highlights) => {
    if (!$highlights) {
        return new Map<ArticleId, NDKHighlight>();
    }

    const articleHighlights = new Map<ArticleId, NDKHighlight[]>();
    for (const highlight of $highlights) {
        const articleId = highlight.getArticleTag();
        if (articleId) {
            const articleHighlight = articleHighlights.get(articleId[1]);
            if (articleHighlight) {
                articleHighlight.push(highlight);
            } else {
                articleHighlights.set(articleId[1], [highlight]);
            }
        }
    }

    return articleHighlights;
});

export function getHighlights(filter: NDKFilter = {}): NDKSubscription {
    const $ndk = getStore(ndk);
    filter.kinds = [NDKKind.Highlight as number];

    const sub = $ndk.subscribe(filter, {
        closeOnEose: false,
        groupable: false,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    });

    sub.on('event', (event: NDKEvent) => {
        event.ndk = $ndk;
        const newHighlight = NDKHighlight.from(event);
        highlights.update(highlights => {
            // Find the correct index to insert the new highlight
            const insertIndex = highlights.findIndex(
                highlight => highlight.created_at! < newHighlight.created_at!
            );

            // Insert new highlight at the correct position
            if (insertIndex !== -1) {
                highlights.splice(insertIndex, 0, newHighlight);
            } else {
                // If no existing highlight has a greater timestamp, add the new highlight to the end
                highlights.push(newHighlight);
            }

            return highlights;
        });

        // // hydrate the cache
        // $ndk.subscribe({
        //     kinds: [1],
        //     '#q': [highlight.id],
        // }, { closeOnEose: true, groupableDelay: 500 });
    });

    return sub;
}
