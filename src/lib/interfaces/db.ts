import Dexie, { type Table } from 'dexie';

export class Database extends Dexie {
    users!: Table<App.UserProfile>;
    events!: Table<App.Event>;
    eventTags!: Table<App.EventTag>;

    constructor() {
        super('highlighterV3');
        this.version(1).stores({
            users: '++id, name, displayName, image, banner, bio, nip05, lud16, about, zapService, event',
            events: 'id, pubkey, kind, [kind+pubkey]',
            eventTags: 'id, tagvalue, tag, value, eventId',
        });
    }
}

export const db = new Database();
