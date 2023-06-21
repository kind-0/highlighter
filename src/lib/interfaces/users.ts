import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/ndk';
import type { GetUserParams, NDKFilterOptions } from '@nostr-dev-kit/ndk';
import { liveQuery, type Observable } from 'dexie';
import { browser } from '$app/environment';
import { db } from '$lib/interfaces/db';

interface ILoadOpts {
    hexpubkey?: string;
}

const UserInterface = {
    get: (opts: GetUserParams): Observable<App.UserProfile> => {
        if (opts.hexpubkey && browser) {
            console.log(`received query for user ${opts.hexpubkey}`)
            db.users
                .where({ id: opts.hexpubkey })
                .first()
                .then((user) => {
                    console.log(`coming back for user ${opts.hexpubkey}`, !!user)
                    if (!user) {
                        const ndk = getStore(ndkStore);
                        const user = ndk.getUser(opts);
                        let userProfile: App.UserProfile = {
                            event: '',
                            ...(user.profile || {}),
                            id: user.hexpubkey(),
                        };

                        console.log('sending fetchProfile request', user.hexpubkey());

                        user.fetchProfile({ groupableDelay: 200 } as NDKFilterOptions).then(async (events) => {
                            userProfile = { ...userProfile, ...(user.profile || {}) };
                            if (events && events.size > 0) userProfile.event = JSON.stringify(Array.from(events)[0].rawEvent());
                            await db.users.put(userProfile);
                        });
                    }
                });
        }

        return liveQuery(() => (browser ? db.users.where({ id: opts.hexpubkey }).first() : {})) as Observable<App.UserProfile>;
    },
};

export default UserInterface;
