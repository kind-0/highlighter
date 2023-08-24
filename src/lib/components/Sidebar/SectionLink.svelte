<script lang="ts">
    export let icon: any | undefined = undefined;
    export let title: string;
    export let href: string;
</script>

<a
    {href}
    class="btn w-full justify-start !rounded-box px-6"
>
    <div class="flex flex-row gap-5 items-center hover:!bg-transparent text-base">
        <slot name="icon" />

        <div class="text-base-100-content font-normal">
            {title}
        </div>
    </div>
</a>