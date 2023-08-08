<script lang="ts">
    import { zapInvoiceFromEvent, type NDKEvent, NDKKind, NDKDVMJobResult } from "@nostr-dev-kit/ndk";
    import AcceptResultButtons from "./AcceptResultButtons.svelte";
    import { currentUser } from "$lib/store";
    import { onDestroy } from "svelte";
    import ndk, { type NDKEventStore } from '$lib/stores/ndk';
    import AvatarWithName from "$lib/components/AvatarWithName.svelte";
    import PaymentRequestButton from "./PaymentRequestButton.svelte";
    import rejectEvent from './reject.js';
    import CheckIcon from "$lib/icons/Check.svelte";
    import EventContent from "$lib/components/events/content.svelte";

    export let events: NDKEvent[];
    export let pubkey: string;
    export let onlyJobsWithResults = false;

    let eventCount: number;
    let resultEvent: NDKDVMJobResult;
    let zappedByUserAmount: number;
    let zaps: NDKEventStore<NDKEvent>;

    let totalAmountRequested: number;
    let pendingAmount: number;

    let paymentRequestEvent: NDKEvent | undefined;
    let jobStatus: string | undefined;

    let isJobFinishedButNotServed: boolean;

    $: if (eventCount !== events.length) {
        eventCount = events.length;

        const r = events.find(event => event.kind === NDKKind.DVMJobResult);
        if (r) resultEvent = NDKDVMJobResult.from(r);
        paymentRequestEvent = chooseEventWithAmount(events);
        subscribeToZapEvents();

        if (paymentRequestEvent) {
            const amountTag = paymentRequestEvent.tagValue('amount');
            totalAmountRequested = amountTag ? parseInt(amountTag) / 1000 : 0;
        } else {
            totalAmountRequested = 0;
        }

        jobStatus = setJobStatus();
        isJobFinishedButNotServed = setIsJobFinishedButNotServed();
    }

    function setIsJobFinishedButNotServed() {
        return !resultEvent && !!events.some((e: NDKEvent) => e.kind === NDKKind.DVMJobFeedback && e.tagValue('status') === 'finished');
    }

    function setJobStatus() {
        // get the most recent event which has a status tag and kind 68003
        const statusEvent = events.filter(event => {
            const status = event.tagValue('status');
            return status && event.kind === NDKKind.DVMJobFeedback;
        }).sort((a, b) => {
            const aTimestamp = a.created_at!;
            const bTimestamp = b.created_at!;
            if (aTimestamp && bTimestamp) {
                if (bTimestamp === aTimestamp) {
                    const orderByStatus = [ 'finished', 'failed', 'started' ]
                    // if the timestamps are the same, sort by the position in orderByStatus
                    return orderByStatus.indexOf(a.tagValue('status')!) - orderByStatus.indexOf(b.tagValue('status')!);
                } else {
                    return bTimestamp - aTimestamp;
                }
            }
            return 0;
        })[0];

        if (statusEvent) {
            const status = statusEvent.tagValue('status');
            if (status) return status;
        }
    }

    function subscribeToZapEvents() {
        if (zaps) zaps.unsubscribe();
        zaps = $ndk.storeSubscribe({
            kinds: [9735],
            "#e": events.map(e => e.tagId())
        }, { closeOnEose: false });
    }

    function chooseEventWithAmount(events: NDKEvent[]): NDKEvent | undefined {
        let event;

        // first find a job-result event with an amount
        event = events.find(event => {
            const isResult = event.kind === NDKKind.DVMJobResult;
            const amountTag = event.tagValue('amount');
            return isResult && amountTag && parseInt(amountTag) > 0;
        });

        // otherwise find any event with an amount
        if (!event) {
            event = events.filter(event => {
                const amountTag = event.tagValue('amount');
                return amountTag && parseInt(amountTag) > 0;
            })

            // sort events by created_at, choose the most recent one
            .sort((a, b) => {
                const aTimestamp = a.created_at!;
                const bTimestamp = b.created_at!;
                if (aTimestamp && bTimestamp) {
                    return bTimestamp - aTimestamp;
                }
                return 0;
            })[0];
        }

        return event;
    }

    // Calculate how much the user owes to this event
    $: pendingAmount = Math.max(0, totalAmountRequested - zappedByUserAmount);

    const user = $ndk.getUser({hexpubkey: pubkey});
    const fetchProfilePromise = user.fetchProfile();

    onDestroy(() => {
        zaps.unsubscribe();
    })

    $: if ($zaps) {
        zappedByUserAmount = $zaps.reduce((acc: number, zap: NDKEvent) => {
            const zapInvoice = zapInvoiceFromEvent(zap);
            if (!zapInvoice) return acc;

            if (zapInvoice.zappee === $currentUser?.hexpubkey()) {
                acc += zapInvoice.amount;
            }

            return acc;
        }, 0);
    }

    function reject() {
        if (!paymentRequestEvent) return;

        rejectEvent(paymentRequestEvent);
    }
</script>

{#if !onlyJobsWithResults || resultEvent}
{#await fetchProfilePromise}
    Loading
{:then}
here
    <div class="card group card-bordered">
        <div class="card-body">
            <div class="flex flex-row items-start justify-stretch w-full">
                <div class="title flex flex-row items-center gap-4 flex-1 text-accent">
                    <AvatarWithName {user} avatarClass="w-14 h-14" nameClass="text-lg">
                        <div slot="bio">
                            <div class="tooltip" data-tip="Not yet ready">
                                <div class="rating rating-sm">
                                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-neutral" />
                                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-neutral" />
                                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-neutral" />
                                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-neutral" />
                                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-neutral" checked />
                                </div>
                            </div>
                        </div>

                    </AvatarWithName>
                    <div class="tooltip" data-tip="Not ready yet">
                        <button class="
                            btn btn-xs btn-outline opacity-10
                            group-hover:opacity-100 transition-all duration-200
                        " disabled>
                            Block
                        </button>
                    </div>
                </div>

                <div class="flex flex-col items-stretch self-stretch gap-2">
                    {#if resultEvent}
                        <div class="flex flex-row items-center">
                            <AcceptResultButtons event={resultEvent} {pendingAmount} />
                        </div>
                    {:else if pendingAmount > 0 && paymentRequestEvent}
                        <PaymentRequestButton
                            event={paymentRequestEvent}
                            {pendingAmount}
                            on:paid={() => pendingAmount = 0}
                        />
                        <div class="card-actions flex flex-col items-stretch">
                            <button class="btn btn-xs btn-ghost btn-neutral" on:click={reject}>
                                Reject
                            </button>
                        </div>
                    {/if}

                    {#if jobStatus}
                        <h5 class="flex flex-col items-center gap-2 opacity-50 h-full text-center">
                            {#if isJobFinishedButNotServed}
                                <div class="flex flex-row gap-2">
                                    <CheckIcon class="w-6 h-6 text-success" />
                                    Results ready
                                </div>
                            {/if}

                            {#if jobStatus === 'started'}
                                Processing
                                <span class="loading loading-ring loading-md"></span>
                            {:else if jobStatus === 'payment-required'}
                                {#if  pendingAmount > 0}
                                    Awaiting payment
                                {/if}
                            {:else if isJobFinishedButNotServed}
                                <!-- empty since its already shown regardless of the status -->
                            {:else}
                                {jobStatus}
                            {/if}
                        </h5>
                    {/if}
                </div>
            </div>

            {#if resultEvent?.content}
                <div class="max-h-48 overflow-auto">
                    <div class="text-sm">
                        <EventContent
                            note={resultEvent.content}
                            tags={resultEvent.tags}
                        />
                    </div>
                </div>
            {:else}
                {user?.profile?.about}
            {/if}


        </div>
    </div>
{:catch e}
    {e}
{/await}
{/if}