import { NDKUser } from "@nostr-dev-kit/ndk";

export async function load({ params }) {
    const {id} = params;

    if (id.startsWith('npub')) {
        return { npub: id };
    }

    const user = await NDKUser.fromNip05(id);

    return {
        npub: user?.npub,
    };
}