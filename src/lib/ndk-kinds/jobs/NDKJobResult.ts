import { NDKEvent } from "@nostr-dev-kit/ndk";

/**
 * A NIP-XX Job Result
 */
export class NDKJobResult extends NDKEvent {
    static from(event: NDKEvent) {
        return new NDKJobResult(event.ndk, event.rawEvent());
    }
}