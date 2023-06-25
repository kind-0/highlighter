import { get as getStore } from 'svelte/store';
import { currentUser as currentUserStore } from '$lib/store';
import ndk from '$lib/stores/ndk';
import { currentUserFollowPubkeys as currentUserFollowPubkeysStore } from '$lib/store';
import type { NDKUser } from '@nostr-dev-kit/ndk';

export async function fetchFollowers(): Promise<void> {
    const $currentUser = getStore(currentUserStore);

    if (!$currentUser) {
        setTimeout(fetchFollowers, 1000);
        return;
    }

    const follows = await $currentUser?.follows();
    const hexpubkeys = Array.from(follows).map((u: NDKUser) => u.hexpubkey());

    const uniqueHexpubkeys = Array.from(new Set(hexpubkeys));

    currentUserFollowPubkeysStore.set(uniqueHexpubkeys);
    localStorage.setItem("currentUserFollowPubkeysStore", JSON.stringify(uniqueHexpubkeys))
}

export function logout(): void {
    const $ndk = getStore(ndk);
    $ndk.signer = undefined;
    currentUserStore.set(null);
    currentUserFollowPubkeysStore.set([]);
    localStorage.removeItem("currentUserFollowPubkeysStore");
    localStorage.removeItem("currentUserStore");

    // explicitly prevent auto-login with NIP-07
    localStorage.setItem("nostr-key-method", "none");
}