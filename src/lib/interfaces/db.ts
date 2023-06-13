import Dexie, { type Table } from 'dexie';

export class Database extends Dexie {
    users!: Table<App.UserProfile>;
    events!: Table<App.Event>;
    eventTags!: Table<App.EventTag>;

    constructor() {
        super('highlighterV2');
        this.version(36).stores({
            users: '++id, name, displayName, image, banner, bio, nip05, lud16, about, zapService, event',
            events: '[kind+pubkey], id, pubkey, kind',
            eventTags: 'id, tagvalue, tag, value, eventId',
        });
    }
}

export const db = new Database();
