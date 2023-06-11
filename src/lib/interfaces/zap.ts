import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/ndk';
import { liveQuery } from 'dexie';
import { browser } from '$app/environment';
import { db } from '$lib/interfaces/db';
import type NDK from '@nostr-dev-kit/ndk';
import type { NDKEvent, NDKFilter, NDKZapInvoice } from '@nostr-dev-kit/ndk';
import { zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';

interface ZapForArgs {
    eventId?: string;
    userId?: string;
}

const ZapInterface = {
    load: (args: ZapForArgs) => {
        const filter: NDKFilter = { kinds: [9735] };
        if (args.eventId) filter['#e'] = [args.eventId];
        if (args.userId) filter['#p'] = [args.userId];

        const ndk: NDK = getStore(ndkStore);
        const subs = ndk.subscribe(filter, { closeOnEose: false, groupableDelay: 2500 });

        subs.on('event', async (event: NDKEvent) => {
            const zapInvoice: NDKZapInvoice | null = zapInvoiceFromEvent(event);
            console.log('event', event)

            if (zapInvoice) {
                const zap: App.Zap = {
                    event: JSON.stringify(event.rawEvent()),
                    ...zapInvoice
                };
                await db.zaps.put(zap);
                console.log(zap);
            }
        });

        if (args.userId) {
            return liveQuery(() =>
                browser ? db.zaps.where({ zapped: args.userId }).toArray() : []
            );
        } else if (args.eventId) {
            return liveQuery(() =>
                browser ? db.zaps.where({ zappedEvent: args.eventId }).toArray() : []
            );
        }
    }
};

export default ZapInterface;
