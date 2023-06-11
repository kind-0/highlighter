import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        href?: string | undefined;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type RoundedButtonProps = typeof __propDef.props;
export type RoundedButtonEvents = typeof __propDef.events;
export type RoundedButtonSlots = typeof __propDef.slots;
export default class RoundedButton extends SvelteComponentTyped<RoundedButtonProps, RoundedButtonEvents, RoundedButtonSlots> {
}
export {};
