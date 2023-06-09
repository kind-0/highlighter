import { findEphemeralSigner } from "$lib/signers/ephemeral";
import { NDKPrivateKeySigner, type NDKUser } from "@nostr-dev-kit/ndk";
import { writable, get as getStore } from "svelte/store";
import ndkStore from './ndk';
import { currentUser as currentUserStore } from "../store";
import type NDKList from "$lib/ndk-kinds/lists";

export type SignerStoreItem = {
    signer: NDKPrivateKeySigner;
    user: NDKUser;
    saved: boolean;
    name?: string;
    id: string;
};

type SignerItems = Map<string, SignerStoreItem>;

const listSigners = writable<SignerItems>(new Map());
export default listSigners;

async function getDelegatedSignerName(list: NDKList) {
    let name = '';
    const currentUser: NDKUser = getStore(currentUserStore);

    if (!currentUser?.profile) {
        currentUser.ndk = getStore(ndkStore);
        await currentUser?.fetchProfile();
    }

    if (currentUser?.profile?.name) {
        name = currentUser.profile.displayName + `'s `;
    }

    return name + list.name;
}

export async function getSigner(list: NDKList): Promise<SignerStoreItem> {
    const store = getStore(listSigners);
    const id = list.encode();
    let item = store.get(id);

    if (item) return item;

    const ndk = getStore(ndkStore);
    let signer = await findEphemeralSigner(
        ndk,
        ndk.signer!,
        {
            associatedEventNip19: list.encode(),
        }
    );

    if (signer) {
        console.log(`found a signer for list ${list.name}`);
        item = {
            signer: signer!,
            user: await signer.user(),
            saved: true,
            id
        };
    } else {
        signer = NDKPrivateKeySigner.generate();
        item = {
            signer,
            user: await signer.user(),
            saved: false,
            name: await getDelegatedSignerName(list),
            id
        };
    }
    item.user.ndk = ndk;

    store.set(id, item);

    return item;
}