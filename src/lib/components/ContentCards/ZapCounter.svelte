<script lang="ts">
    import ZapCounterIcon from "$icons/ZapCounterIcon.svelte";
    import { nicelyFormattedMilliSatNumber } from "$utils";
    
    let zappedAmount: number = 1000000;

</script>

<div class="h-7 w-fit flex items-center px-3 gap-2 bg-base-200  rounded-full">
    <span class="text-right text-xs uppercase font-normal">{nicelyFormattedMilliSatNumber(zappedAmount)}</span>
    <ZapCounterIcon />
</div>