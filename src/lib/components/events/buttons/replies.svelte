<script lang="ts">
    import { openModal } from 'svelte-modals'
    import { Tooltip } from 'flowbite-svelte';

    import CommentIcon from '$lib/icons/Comment.svelte';

    import ReplyModal from '$lib/modals/Reply.svelte';
    import type { NDKEvent, NDKSigner, NDKUser } from '@nostr-dev-kit/ndk';

    import { signers } from '$lib/stores/signer';

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


</script>

<button class="
    text-slate-500 hover:text-orange-500
    flex flex-row items-center gap-2
" on:click={open}>
    <CommentIcon class="w-4 h-4" />
</button>
<Tooltip color="default">Reply</Tooltip>