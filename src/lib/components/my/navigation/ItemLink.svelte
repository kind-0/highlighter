<script lang="ts">
    import NavigationButton from './Button.svelte';
    import type NDKList from '$lib/ndk-kinds/lists';

    export let activeItem: boolean = false
    export let item: NDKList
</script>

<NavigationButton
    active={activeItem}
    route="/lists/{item.encode()}"
>
    <span
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600"
    >
        {item?.name?.slice(0, 1)}
    </span>
    <span class="truncate">{item.name}</span>
</NavigationButton>
