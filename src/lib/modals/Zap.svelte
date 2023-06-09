<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import UserCard from '$lib/components/UserCard.svelte';
    import PillButton from '$lib/components/buttons/pill.svelte';
    import Input from '$lib/components/Input.svelte';
    import CloseIcon from '$lib/icons/Close.svelte';
    import { NDKEvent, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';
    import { requestProvider } from 'webln';

    import { closeModal } from 'svelte-modals';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
  import ModalWrapper from '$lib/components/ModalWrapper.svelte';
  import RoundedButton from '../../routes/(main)/components/RoundedButton.svelte';

    export let event: NDKEvent;
    export let highlight: App.Highlight;
    export let article: App.Article;

    let amount = '1000';
    let comment = '';

    async function zap() {
        // await $ndk.connect();
        let zappedEvent = new NDKEvent($ndk, JSON.parse(highlight.event));
        let pr = await zappedEvent.zap(highlighterAmount*1000, comment);

        if (!pr) {
            console.log('no payment request');
            return;
        }

        try {
            const webln = await requestProvider();
            const res = await webln.sendPayment(pr);
        } catch (err: any) {
            console.log(err);
        }

        zappedEvent = new NDKEvent($ndk, JSON.parse(article.event));
        pr = await zappedEvent.zap(authorAmount*1000, comment, [['e', highlight.id]]);

        if (!pr) {
            console.log('no payment request');
            return;
        }

        try {
            const webln = await requestProvider();
            const res = await webln.sendPayment(pr);
        } catch (err: any) {
            console.log(err);
            // should we unlock the mutex here if the user rejected the payment?
        }
    }

    let authorAmount: number, publisherAmount: number, highlighterAmount: number;
    let showAuthor: boolean, showPublisher: boolean, showHighlighter: boolean;

    onMount(() => {
        if (article?.author)
            showAuthor = true;

        if (highlight?.pubkey && highlight.pubkey !== article?.author)
            showHighlighter = true;

        if (article?.publisher && article?.publisher !== article?.author)
            showPublisher = true;

        changeAmount();
    });

    function changeAmount() {
        const iAmount = parseInt(amount);

        if (showAuthor && showPublisher && showHighlighter) {
            authorAmount = iAmount * 0.7;
            publisherAmount = iAmount * 0.1;
            highlighterAmount = iAmount * 0.2;
        } else if (showAuthor && showPublisher) {
            authorAmount = iAmount * 0.9;
            publisherAmount = iAmount * 0.1;
        } else if (showAuthor && showHighlighter) {
            authorAmount = iAmount * 0.8;
            highlighterAmount = iAmount * 0.2;
        } else if (showPublisher && showHighlighter) {
            publisherAmount = iAmount * 0.6;
            highlighterAmount = iAmount * 0.4;
        } else if (showAuthor) {
            authorAmount = iAmount;
        } else if (showPublisher) {
            publisherAmount = iAmount;
        } else if (showHighlighter) {
            highlighterAmount = iAmount;
        }
    }
</script>

<ModalWrapper>
    <button class="
        text-zinc-500 hover:text-zinc-300 transition duration-300
        absolute top-2 right-2
    " on:click={closeModal}>
        <CloseIcon />
    </button>
    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">SPLITS</h2>

        {#if article?.author}
            <UserCard pubkey={article.author} subtitle="AUTHOR">
                <div slot="right">
                    ⚡️ {authorAmount}
                </div>
            </UserCard>
        {/if}

        {#if article?.publisher && article?.publisher !== article?.author}
            <UserCard pubkey={article.publisher} subtitle="PUBLISHER">
                <div slot="right">
                    ⚡️ {publisherAmount}
                </div>
            </UserCard>
        {/if}

        {#if highlight && highlight.pubkey !== article?.author}
            <UserCard pubkey={highlight.pubkey} subtitle="HIGHLIGHTER">
                <div slot="right">
                    ⚡️ {highlighterAmount}
                </div>
            </UserCard>
        {/if}
    </div>

    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">
            AMOUNT
        </h2>

        <div class="flex flex-row">
            <PillButton bind:group={amount} on:change={changeAmount} value="1000">
                👍 1k
            </PillButton>
            <PillButton bind:group={amount} on:change={changeAmount} value="5000">
                💜 5k
            </PillButton>
            <PillButton bind:group={amount} on:change={changeAmount} value="10000">
                😍 10k
            </PillButton>
            <PillButton bind:group={amount} on:change={changeAmount} value="50000">
                🤩 50k
            </PillButton>
            <PillButton bind:group={amount} on:change={changeAmount} value="100000">
                🤯 100k
            </PillButton>
        </div>
    </div>

    <div class="flex flex-col gap-3">
        <h2 class="text-zinc-500 font-semibold text-base uppercase">
            COMMENT
        </h2>

        <Input
            type="text"
            maxlength="50"
            placeholder="Add a comment..."
            bind:value={comment} />
    </div>

    <RoundedButton class="w-full py-3 text-lg rounded-md" on:click={zap}>
        ZAP
    </RoundedButton>
</ModalWrapper>
