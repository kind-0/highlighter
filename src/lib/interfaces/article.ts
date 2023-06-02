import { get as getStore } from 'svelte/store';
import ndkStore from '../stores/ndk';
import { liveQuery } from 'dexie';
import { db } from '$lib/interfaces/db';
import type NDK from '@nostr-dev-kit/ndk';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';

function valueFromTag(event: NDKEvent, tag: string): string | undefined {
    const matchingTag = event.tags.find((t: string[]) => t[0] === tag);

    if (matchingTag) return matchingTag[1];
}

interface ILoadOpts {
    naddr?: string,
    id?: string,
    url?: string
};

const ArticleInterface = {
    load: (opts: ILoadOpts = {}) => {
        const filter: NDKFilter = {};
        let queryId: string = '';
        if (opts.naddr) {
            const decode = nip19.decode(opts.naddr).data as any;
            filter['kinds'] = [decode.kind];
            filter['#d'] = [decode.identifier];
            filter['authors'] = [decode.pubkey];
            queryId = `${decode.kind}:${decode.pubkey}:${decode.identifier}`
        } else if (opts.id) {
            const [ kind, pubkey, identifier ] = opts.id.split(':');
            filter['kinds'] = [parseInt(kind)];
            filter['#d'] = [identifier];
            filter['authors'] = [pubkey];
            queryId = opts.id
        } else if (opts.url) {
            filter['kinds'] = [30023];
            filter['#r'] = [opts.url];
            queryId = opts.url
        }

        const ndk: NDK = getStore(ndkStore);

        const subs = ndk.subscribe(filter);

        subs.on('event', async (event: NDKEvent) => {
            const url = valueFromTag(event, 'r') || '';
            const title = valueFromTag(event, 'title') || '';

            try {
                const article: App.Article = {
                    id: event.tagId(),
                    url,
                    title,
                    publisher: event.pubkey,
                    content: event.content,
                    author: valueFromTag(event, 'author') || event.pubkey,
                    tags: event.tags.filter(t => t[0] === 't').map(t => t[1]),
                    event: JSON.stringify(await event.toNostrEvent())
                };

                await db.articles.put(article);
            } catch (e) {
                console.error(e);
            }
        });

        if (opts.url) {
            return liveQuery(() =>
                db.articles.where({url: opts.url}).toArray()
            );
        } else if (queryId) {
            return liveQuery(() =>
                db.articles.where({id: queryId}).toArray()
            );
        } else {
            console.error('not know how to reply to article load', opts);
        }
    },
};

export function articleFromEvent(event: NDKEvent): App.Article {
    const url = valueFromTag(event, 'r') || '';
    const title = valueFromTag(event, 'title') || '';

    return {
        id: event.tagId(),
        url,
        title,
        tags: event.tags.filter(t => t[0] === 't').map(t => t[1]),
        author: valueFromTag(event, 'author') || event.pubkey,
        publisher: event.pubkey,
        content: event.content,
        event: JSON.stringify(event.rawEvent()),
    };
}

export default ArticleInterface;
