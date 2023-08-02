import { goto } from "$app/navigation";
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { pay } from '$lib/utils/pay';

export default async function chooseResult(pendingAmount: number, event: NDKEvent) {
    // check if we need to zap it
    if (pendingAmount > 0) {
        event.zap(pendingAmount*1000).then((pr) => {
            if (pr) pay(pr);
        });
    }

    goto(`/a/${event.encode()}`);
}

