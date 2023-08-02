import type NDK from "@nostr-dev-kit/ndk";
import { NDKEvent, type NDKTag, type NostrEvent } from "@nostr-dev-kit/ndk";
import { filterForId } from "$lib/utils";

type classWithConvertFunction<T> = {
    from: (event: NDKEvent) => T;
};

class NDKRepost<T> extends NDKEvent {
    private _repostedEvents: T[] | undefined;

    constructor(ndk?: NDK, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
    }

    static from(event: NDKEvent) {
        return new NDKRepost(event.ndk, event.rawEvent());
    }

    async repostedEvents(klass?: classWithConvertFunction<T>): Promise<(T|NDKEvent)[]> {
        const items: (T|NDKEvent)[] = [];

        if (!this.ndk) throw new Error('NDK instance not set');

        if (this._repostedEvents !== undefined) return this._repostedEvents;

        for (const eventId of this.repostedEventIds()) {
            const filter = filterForId(eventId);
            const event = await this.ndk.fetchEvent(filter);

            if (event) {
                items.push(
                    klass ? klass.from(event) : event
                );
            }
        }

        return items;
    }

    repostedEventIds(): string[] {
        return this.tags.filter(
            (t: NDKTag) => t[0] === 'e' || t[0] === 'a'
        ).map(
            (t: NDKTag) => t[1]
        );
    }
}

export default NDKRepost;