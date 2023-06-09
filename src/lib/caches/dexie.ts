import {NDKEvent} from '@nostr-dev-kit/ndk';
import { db } from '$lib/interfaces/db';
import type { NDKCacheAdapter, NDKFilter, NDKSubscription, NDKUserProfile } from '@nostr-dev-kit/ndk';

export default class DexieAdapter implements NDKCacheAdapter {
    readonly locking = true;

    /**
     * Searches by authors
     */
    private async byAuthors(filterKeys: string[], subscription: NDKSubscription): Promise<boolean> {
        const f = ['authors'];
        const hasAllKeys = filterKeys.length === f.length && f.every(k => filterKeys.includes(k))

        if (hasAllKeys) {
            for (const pubkey of (subscription.filter?.authors!)) {
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
        const hasAllKeys = filterKeys.length === f.length && f.every(k => filterKeys.includes(k))

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
        const hasAllKeys = filterKeys.length === f.length && f.every(k => filterKeys.includes(k))

        if (hasAllKeys) {
            for (const _kind of subscription.filter['kinds']) {
                const kind = parseInt(_kind as any);
                const replaceableKind = (kind >= 30000 && kind < 40000);

                if (!replaceableKind) continue;

                for (const author of subscription.filter['authors']) {
                    for (const dTag of subscription.filter['#d']) {
                        const replaceableId = `${kind}:${author}:${dTag}`
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
        const hasAllKeys = filterKeys.length === f.length && f.every(k => filterKeys.includes(k))

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
                    subscription.eventReceived(ndkEvent, undefined, true);

                    // Return true if the condition is met to stop execution
                    return true;
                }
            }
        }

        return false;
    }


    public async query(subscription: NDKSubscription): Promise<void> {
        const filterKeys = Object.keys(subscription.filter || {}).sort();

        (await this.byAuthors(filterKeys, subscription)) ||
        (await this.byIdsQuery(filterKeys, subscription)) ||
        (await this.byNip33Query(filterKeys, subscription))
        // (await this.byKindAndAuthor(filterKeys, subscription));
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
            })
        } else {
            db.events.put({
                id: event.tagId(),
                pubkey: event.pubkey,
                kind: event.kind as number,
                createdAt: event.created_at as number,
                json: JSON.stringify(event.rawEvent()),
            });
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