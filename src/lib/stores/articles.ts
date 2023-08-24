import { NDKKind, NDKArticle, type NDKFilter } from "@nostr-dev-kit/ndk";
import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";
import { get } from "svelte/store";
import ndk from "./ndk";

const baseFilters: NDKFilter[] = [ { kinds: [NDKKind.Article as number], limit: 10 } ];

export const newArticles: NDKEventStore<NDKArticle> = get(ndk).storeSubscribe(
    baseFilters, {
        autoStart: false,
        closeOnEose: false,
        subId: "new-articles-store",
        unrefUnsubscribeTimeout: 5000,
    },
    NDKArticle
);

export function setNewArticlesFilters(extraFilter: NDKFilter = {}) {
    const f = [
        ...baseFilters,
    ].map((filter) => {
        return {
            ...filter,
            ...extraFilter
        };
    });

    newArticles.changeFilters(f);
}
