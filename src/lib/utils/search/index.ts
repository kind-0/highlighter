import { goto } from "$app/navigation";
import { tryToLoadBech32, tryToLoadDVM, tryToLoadTopic, tryToLoadUserBech32 } from "./matchers";

export type MediaType = 'audio' | 'video' | 'image' | 'overcast' | 'youtube' | 'web' | 'bech32' | 'topic';
export type ProcessingInstructions = {
    type?: MediaType | undefined,
    dvm?: boolean,
    url?: string,
    title?: string,
    image?: string,
    embed?: string,
    audio?: string,
};

/**
 * Converts a query input from the user into the type of action that should be
 * offered to the user
 * @param query
 * @param authorPubkey
 * @returns
 */
export async function getSearchProcessingInstructions(query: string, authorPubkey?: string): Promise<ProcessingInstructions> {
    const result: ProcessingInstructions = {};

    if ((result.type = tryToLoadUserBech32(query))) return result;
    if ((result.type = tryToLoadBech32(query))) return result;
    if ((result.type = tryToLoadTopic(query))) return result;

    if (!result.type) {
        result.type = tryToLoadDVM(query);
        result.dvm = !!result.type;
        result.url = query;
    }

    switch (result.type) {
    case 'overcast', 'youtube': {
        const res = await fetch(`/api/cors?url=${encodeURIComponent(query)}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();

        if (data) {
            if (data.embed) { result.embed = data.embed; }
            if (data.title) { result.title = data.title; }
            if (data.image) { result.image = data.image; }
            if (data.audio) { result.url = data.audio; }
        }
        break;
    }
    }

    if (!result.type) {
        let loadUrl = `/load?url=${encodeURIComponent(query)}`;
        if (authorPubkey) {
            loadUrl += `&author=${encodeURIComponent(authorPubkey)}`;
        }

        result.url = loadUrl;

        goto(result.url);
    // } else {
    //     // check if there are jobs that have transcribed this thing
    //     priorJobRequests = $ndk.storeSubscribe({
    //         kinds: [68001 as number],
    //         '#i': [query],
    //     }, { closeOnEose: true, groupable: false }, NDKJobRequest)
    }

    return result;
}