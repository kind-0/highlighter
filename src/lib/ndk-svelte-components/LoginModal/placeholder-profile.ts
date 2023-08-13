import { NDKUser, type NDKUserProfile } from "@nostr-dev-kit/ndk";
import { get as getStore } from 'svelte/store';
import { currentUser } from '$lib/store';
import ndk from '$lib/stores/ndk';

export async function setupPlaceholderProfile(profile?: NDKUserProfile) {
    const $currentUser = getStore(currentUser);
    const $ndk = getStore(ndk);

    if (!$currentUser) throw new Error('No current user');
    $currentUser.ndk = $ndk;

    const imagehash = $currentUser.npub;

    const p = {
        image: `https://robohash.org/${imagehash}.png?size=200x200&set=set5`,
        name: `New Nostr User`,
        bio: `Hi! I'm a brand new nostr user trying things out. Be nice!`,
        ...profile
    };

    $currentUser.profile = p;
    await $currentUser.publish();

    const pablo = new NDKUser({npub: 'npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft'});
    await $currentUser.follow(pablo);
}