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
    hexpubkeys.push($currentUser.hexpubkey());

    const uniqueHexpubkeys = Array.from(new Set(hexpubkeys));

    currentUserFollowPubkeysStore.set(uniqueHexpubkeys);
    localStorage.setItem("currentUserFollowPubkeysStore", JSON.stringify(uniqueHexpubkeys));
}

export function logout(): void {
    const $ndk = getStore(ndk);
    $ndk.signer = undefined;
    currentUserStore.set(null);
    currentUserFollowPubkeysStore.set([]);
    localStorage.removeItem("currentUserFollowPubkeysStore");
    localStorage.removeItem("currentUserStore");
    localStorage.removeItem("user-follows");
    localStorage.removeItem("network-follows");
    localStorage.removeItem("network-follows-updated-t");
    localStorage.removeItem("currentUserNpub");
    localStorage.removeItem("nostr-target-npub");

    // explicitly prevent auto-login with NIP-07
    localStorage.setItem("nostr-key-method", "none");
}