<script lang="ts">
    import UserInterface from '$lib/interfaces/users';
    import type { Observable } from 'dexie';
    import ndk from '$lib/stores/ndk';
    import {Avatar} from '@nostr-dev-kit/ndk-svelte-components';

    import { createDraggableEvent } from '$lib/utils/draggable';
    import { NDKUser } from '@nostr-dev-kit/ndk';

    export let pubkey: string | undefined = undefined;
    export let userProfile: App.UserProfile | undefined = undefined;
    export let klass: string = $$props.class??'';
    export let size: "xs" | "sm" | "md" | "lg" | "xl" | undefined = 'md';
</script>

<Avatar ndk={$ndk} {pubkey} class="w-8 h-8 rounded-full {$$props.class??klass}" />