import { NDKEvent } from '@nostr-dev-kit/ndk';
import { db } from '$lib/interfaces/db';
import type { NDKCacheAdapter, NDKFilter, NDKSubscription, NDKUserProfile } from '@nostr-dev-kit/ndk';

export default class DexieAdapter implements NDKCacheAdapter {
    readonly locking = true;

    /**
     * Searches by authors
     */
    private async byAuthors(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        const f = ['authors'];
        const hasAllKeys = filterKeys.length === f.length && f.every((k) => filterKeys.includes(k));

        if (hasAllKeys) {
            for (const pubkey of subscription.filter?.authors!) {
                const event = await db.events.where({ pubkey }).first();
                if (!event) continue;

                let rawEvent;
                try {
                    rawEvent = JSON.parse(event.json);
                } catch (e) {
                    // console.log('failed to parse event', e);
                    continue;
                }

                const ndkEvent = new NDKEvent(undefined, rawEvent);
                // console.log(`cache hit by authors`, subscription.filter);
                subscription.eventReceived(ndkEvent, undefined, true);
            }

            return true;
        }

        return false;
    }

    /**
     * Searches by ids
     */
    private async byIdsQuery(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        const f = ['ids'];
        const hasAllKeys = filterKeys.length === f.length && f.every((k) => filterKeys.includes(k));

        if (hasAllKeys) {
            for (const id of subscription.filter.ids!) {
                const event = await db.events.where({ id }).first();
                if (!event) continue;

                let rawEvent;
                try {
                    rawEvent = JSON.parse(event.json);
                } catch (e) {
                    // console.log('failed to parse event', e);
                    continue;
                }

                const ndkEvent = new NDKEvent(undefined, rawEvent);
                // console.log(`cache hit by ids`, subscription.filter);
                subscription.eventReceived(ndkEvent, undefined, true);
            }

            return true;
        }

        return false;
    }

    /**
     * Searches by NIP-33
     */
    private async byNip33Query(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        const f = ['#d', 'authors', 'kinds'];
        const hasAllKeys = filterKeys.length === f.length && f.every((k) => filterKeys.includes(k));

        if (hasAllKeys) {
            for (const _kind of subscription.filter['kinds']) {
                const kind = parseInt(_kind as any);
                const replaceableKind = kind >= 30000 && kind < 40000;

                if (!replaceableKind) continue;

                for (const author of subscription.filter['authors']) {
                    for (const dTag of subscription.filter['#d']) {
                        const replaceableId = `${kind}:${author}:${dTag}`;
                        const event = await db.events.where({ id: replaceableId }).first();
                        if (!event) continue;

                        let rawEvent;
                        try {
                            rawEvent = JSON.parse(event.json);
                        } catch (e) {
                            // console.log('failed to parse event', e);
                            continue;
                        }

                        const ndkEvent = new NDKEvent(undefined, rawEvent);
                        // console.log(`cache hit by NIP-33`, subscription.filter);
                        subscription.eventReceived(ndkEvent, undefined, true);
                    }
                }
            }

            return true;
        }

        return false;
    }

    private async byKindAndAuthor(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        const f = ['authors', 'kinds'];
        const hasAllKeys = filterKeys.length === f.length && f.every((k) => filterKeys.includes(k));

        if (hasAllKeys) {
            // Rest of the code remains the same
            for (const _kind of subscription.filter['kinds']!) {
                const kind = parseInt(_kind as any);
                // Add any additional conditions for your logic here

                for (const author of subscription.filter['authors']!) {
                    const event = await db.events.where({ kind, pubkey: author }).first();
                    if (!event) continue;

                    let rawEvent;
                    try {
                        rawEvent = JSON.parse(event.json);
                    } catch (e) {
                        // console.log('failed to parse event', e);
                        continue;
                    }

                    const ndkEvent = new NDKEvent(undefined, rawEvent);
                    // console.log(`cache hit by kind and author`, subscription.filter);
                    subscription.eventReceived(ndkEvent, undefined, true);

                    // Return true if the condition is met to stop execution
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Searches by tags and optionally filters by tags
     */
    private async byTagsAndOptionallyKinds(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        for (const filterKey of filterKeys) {
            const isKind = filterKey === 'kinds';
            const isTag = filterKey.startsWith('#') && filterKey.length === 2;

            if (!isKind && !isTag) return false;
        }

        // console.log(`will try to check for cache hit by kind and tags`, subscription.filter);

        const events = await this.filterByTag(filterKeys, subscription.filter);
        const kinds = subscription.filter.kinds as number[];

        for (const event of events) {
            if (!kinds.includes(event.kind!)) continue;

            // console.log(`cache hit by kind and tags`, subscription.filter);
            subscription.eventReceived(event, undefined, true);
        }
    }

    private async filterByTag(filterKeys: string[], filter: NDKFilter): Promise<NDKEvent[]> {
        const retEvents: NDKEvent[] = [];

        for (const filterKey of filterKeys) {
            if (filterKey.length !== 2) continue;
            const tag = filterKey.slice(1);
            const values = filter![filterKey] as string[];

            // console.log(`will try to check for cache hit by tag ${tag} and values ${values}`, filter);

            for (const value of values) {
                const eventTags = await db.eventTags.where({ tagvalue: tag + value }).toArray();
                if (!eventTags.length) continue;

                // console.log(`found ${eventTags.length} events with tag ${tag+value}`)

                const eventIds = eventTags.map((t) => t.eventId);

                const events = await db.events.where('id').anyOf(eventIds).toArray();
                for (const event of events) {
                    let rawEvent;
                    try {
                        rawEvent = JSON.parse(event.json);
                    } catch (e) {
                        // console.log('failed to parse event', e);
                        continue;
                    }

                    const ndkEvent = new NDKEvent(undefined, rawEvent);
                    retEvents.push(ndkEvent);
                }
            }
        }

        return retEvents;
    }

    public async query(subscription: NDKSubscription): Promise<void> {
        // console.log(JSON.stringify(subscription.filter));
        const filterKeys = Object.keys(subscription.filter || {}).sort();

        (await this.byAuthors(filterKeys, subscription)) ||
            (await this.byIdsQuery(filterKeys, subscription)) ||
            (await this.byNip33Query(filterKeys, subscription)) ||
            (await this.byKindAndAuthor(filterKeys, subscription)) ||
            (await this.byTagsAndOptionallyKinds(filterKeys, subscription));
    }

    public async setEvent(event: NDKEvent, filter: NDKFilter): Promise<void> {
        if (event.kind === 0) {
            let profile = profileFromEvent(event, {});

            db.users.put({
                id: event.pubkey,
                name: profile.name,
                displayName: profile.displayName,
                image: profile.image,
                banner: profile.banner,
                bio: profile.bio,
                nip05: profile.nip05,
                lud16: profile.lud16,
                about: profile.about,
                zapService: profile.zapService,
                event: JSON.stringify(event.rawEvent()),
            });
        } else {
            let addEvent = true;

            if (event.isParamReplaceable()) {
                const replaceableId = `${event.kind}:${event.pubkey}:${event.tagId()}`;
                const existingEvent = await db.events.where({ id: replaceableId }).first();
                if (existingEvent && existingEvent.createdAt > event.created_at!) {
                    addEvent = false;
                }
            }

            if (addEvent) {
                db.events.put({
                    id: event.tagId(),
                    pubkey: event.pubkey,
                    kind: event.kind as number,
                    createdAt: event.created_at as number,
                    json: JSON.stringify(event.rawEvent()),
                });

                event.tags.forEach((tag) => {
                    if (tag[0].length !== 1) return;

                    db.eventTags.put({
                        id: `${event.id}:${tag[0]}:${tag[1]}`,
                        eventId: event.id,
                        tag: tag[0],
                        value: tag[1],
                        tagvalue: tag[0] + tag[1],
                    });
                });
            }
        }
    }
}

function profileFromEvent(event: NDKEvent, profile: NDKUserProfile): NDKUserProfile {
    const payload = JSON.parse(event.content);

    if (payload.name) profile.name = payload.name;
    if (payload.display_name) profile.displayName = payload.display_name;
    if (payload.displayName) profile.displayName = payload.displayName;
    if (payload.image) profile.image = payload.image;
    if (payload.picture) profile.image = payload.picture;
    if (payload.banner) profile.banner = payload.banner;
    if (payload.bio) profile.bio = payload.bio;
    if (payload.nip05) profile.nip05 = payload.nip05;
    if (payload.lud06) profile.lud06 = payload.lud06;
    if (payload.lud16) profile.lud16 = payload.lud16;
    if (payload.about) profile.about = payload.about;
    if (payload.zapService) profile.zapService = payload.zapService;

    return profile;
}
