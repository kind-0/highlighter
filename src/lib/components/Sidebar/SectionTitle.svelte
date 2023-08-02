<script lang="ts">
    export let title: string;
    export let reverse: boolean = false;
</script>

<div class="
    flex items-center gap-2 w-full
    {reverse ? 'flex-row-reverse' : 'flex-row'}
">
    <div class="divider flex-grow">
    </div>
    <div class="text-xs whitespace-nowrap truncate uppercase">{title}</div>
</div>