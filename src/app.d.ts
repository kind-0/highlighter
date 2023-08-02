declare global {
    namespace App {
        interface Event {
            id: string;
            pubkey: string;
            kind: number;
            relay?: string;
            createdAt: number;
            json: string;
        }

        interface EventTag {
            id: string;
            tag: string;
            value: string;
            eventId: string;
            tagvalue: string;
        }

        interface UserProfile {
            id?: string;
            name?: string;
            displayName?: string;
            image?: string;
            banner?: string;
            bio?: string;
            nip05?: string;
            lud16?: string;
            about?: string;
            zapService?: string;
            event: string;
        }
    }
}

export {};
