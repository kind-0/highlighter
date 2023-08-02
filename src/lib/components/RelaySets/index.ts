import Dexie from "dexie";
import NDKRelayList from "$lib/ndk-kinds/lists/relay-list";

/**
 * Get the naddr of the current relay set
 */
export function currentRelaySet(): NDKRelayList | undefined {
    const current = localStorage.getItem('relaySet');

    console.log({current});

    if (current) {
        try {
            return new NDKRelayList(undefined, JSON.parse(current));
        } catch (e) { /* empty */ }
    }

    return undefined;
}

export function changeRelaySet(relaySet: NDKRelayList) {
    // save the relay set to local storage
    const relayUrls = relaySet.tags
        .filter(t => t[0] === 'r')
        .map((tag) => tag[1]);
    localStorage.setItem('relays', JSON.stringify(relayUrls));
    localStorage.setItem('relaySet', JSON.stringify(relaySet.rawEvent()));
    Dexie.delete('highlighterV4');

    // reload the window
    window.location.reload();
}

export function reset() {
    localStorage.removeItem('relays');
    localStorage.removeItem('relaySet');
    Dexie.delete('highlighter');

    // reload the window
    window.location.reload();
}