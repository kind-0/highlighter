import { SvelteComponentTyped } from 'svelte';
import { NDKUser } from '@nostr-dev-kit/ndk';
import type { NDKSigner } from '@nostr-dev-kit/ndk/lib/src/signers';
declare const __propDef: {
    props: {
        title: string;
        body?: string | undefined;
        visibility: string;
        expandEditor?: boolean | undefined;
        delegatedUser?: NDKUser | undefined;
        delegatedName?: string | undefined;
        delegatedSigner?: NDKSigner | undefined;
    };
    events: {
        keyup: CustomEvent<any>;
        saved: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NoteEditorProps = typeof __propDef.props;
export type NoteEditorEvents = typeof __propDef.events;
export type NoteEditorSlots = typeof __propDef.slots;
export default class NoteEditor extends SvelteComponentTyped<NoteEditorProps, NoteEditorEvents, NoteEditorSlots> {}
export {};
