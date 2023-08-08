import { goto } from "$app/navigation";
import { NDKDVMJobResult, NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
import { pay } from '$lib/utils/pay';
import ndk from '$lib/stores/ndk';
import { get as getStore } from 'svelte/store';

export default async function chooseResult(pendingAmount: number, event: NDKDVMJobResult) {
    const $ndk = getStore(ndk);
    const jobRequest = event.jobRequest;

    debugger

    if (jobRequest) {
        const nip89event = new NDKEvent($ndk, {
            kind: 31989,
            tags: [
                [ 'd', jobRequest.kind ]
            ]
        } as NostrEvent);

        nip89event.tag(event.author);
        nip89event.sign().then(() => {
            nip89event.publish();
        });
    }

    // check if we need to zap it
    if (pendingAmount > 0) {
        event.zap(pendingAmount*1000).then((pr) => {
            if (pr) pay(pr);
        });
    }

    goto(`/a/${event.encode()}`);
}

