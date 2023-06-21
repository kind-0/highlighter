<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import {Avatar} from '@nostr-dev-kit/ndk-svelte-components';

    export let pubkey: string | undefined = undefined;
    export let klass: string = $$props.class??'';
</script>

<Avatar ndk={$ndk} {pubkey} class="rounded-full {$$props.class??klass}" />