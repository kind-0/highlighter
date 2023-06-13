import { SvelteComponentTyped } from 'svelte';
import type { NDKUser } from '@nostr-dev-kit/ndk';
declare const __propDef: {
    props: {
        delegatedName?: string | undefined;
        delegatedUser?: NDKUser | undefined;
        value: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type VisibilityProps = typeof __propDef.props;
export type VisibilityEvents = typeof __propDef.events;
export type VisibilitySlots = typeof __propDef.slots;
export default class Visibility extends SvelteComponentTyped<VisibilityProps, VisibilityEvents, VisibilitySlots> {}
export {};
