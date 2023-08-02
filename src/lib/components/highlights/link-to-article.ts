import type NDKHighlight from "$lib/ndk-kinds/highlight";
import { tagToNip19 } from '$lib/utils';

export default function linkToArticle(highlight: NDKHighlight) {
    const tag = highlight.getArticleTag();

    if (!tag) return '#';

    const val = tagToNip19(tag);

    if (!val) return '#';

    if (val.startsWith('http')) {
        return `/load?url=${encodeURIComponent(val)}`;
    } else if (val.startsWith('n')) {
        return `/a/${val}`;
    } else {
        return '#';
    }
}