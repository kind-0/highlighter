<script lang="ts">
    import acceptResult from "./accept-result.js";
    import rejectEvent from "./reject.js";
    import ButtonWithBorderGradient2 from "$lib/components/buttons/ButtonWithBorderGradient2.svelte";
    import { CaretDown } from "phosphor-svelte";
    import type { NDKDVMJobResult } from "@nostr-dev-kit/ndk";

    export let event: NDKDVMJobResult;
    export let pendingAmount: number;

    function chooseResult() {
        acceptResult(pendingAmount, event);
    }

    function reject(reason?: string) {
        return () => { rejectEvent(event, reason) };
    }
</script>

<div>
    <div class="card-actions flex flex-row items-center">
        <div class="join p-0 flex flex-row items-center">
            <button class="
                btn btn-xs btn-base-100 opacity-100 join-item
                group-hover:opacity-100 transition-all duration-200
            " on:click={()=>{}}>
                Reject
            </button>
            <div class="dropdown dropdown-end join-item">
                <label tabindex="0" class="
                    btn btn-xs btn-base-200 opacity-100 join-item
                    group-hover:opacity-100 transition-all duration-200
                ">
                    <CaretDown class="w-4 h-4" />
                </label>

                <ul tabindex="0" class="dropdown-content bg-base-300 z-[1] menu p-2 shadow rounded-box">
                    <li><button on:click={reject('Too slow')}>Too slow</button>
                    <li><button on:click={reject('Too expensive')}>Too expensive</button>
                    <li><button on:click={reject('Poor results')}>Poor results</button>
                    <li><button on:click={reject()}>
                        No reason
                    </button>
                </ul>
            </div>
        </div>

        <ButtonWithBorderGradient2 on:click={chooseResult}>
            <div class=" flex flex-col">
                Select this result
                {#if pendingAmount}
                    <div class="text-xs font-light">
                        {pendingAmount} sats
                    </div>
                {/if}
            </div>
        </ButtonWithBorderGradient2>
    </div>
</div>