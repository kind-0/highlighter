<script lang="ts">
    import { openModal } from 'svelte-modals'

    import CommentIcon from '$lib/icons/Comment.svelte';

    import ReplyModal from '$lib/modals/Reply.svelte';
    import type { NDKEvent, NDKSigner, NDKUser } from '@nostr-dev-kit/ndk';

    import { signers } from '$lib/stores/signer';
    import { currentUser } from '$lib/store';

    export let event: NDKEvent;

    function open() {
        let delegatedSigner: NDKSigner | undefined;
        let delegatedUser: NDKUser | undefined;

        const user = event.author;
        const signer = Array.from($signers.values()).find(s => s.user.npub === user.npub)

        if (signer) {
            delegatedSigner = signer.signer;
            delegatedUser = signer.user;
        }

        openModal(ReplyModal, { event, delegatedSigner, delegatedUser });
    }

    let tooltip: string;

    $: tooltip = $currentUser ? 'Reply' : 'You are not logged in';
</script>

<div class="tooltip" data-tip={tooltip}>
    <button class="w-4 h-4 {$$props.class}" on:click={open}>
        <CommentIcon class="w4 h-4" />
    </button>
</div>