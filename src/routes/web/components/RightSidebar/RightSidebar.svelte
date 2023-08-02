<script lang="ts">
    import MenuItem from "$lib/components/Sidebar/MenuItem.svelte";
</script>

<ul class="menu bg-base-200 w-full rounded-box overflow-hidden">
    <li class="menu-title uppercase">Recent transcriptions</li>

    <MenuItem href="/highlights/network/newest">
        <div class="flex flex-row gap-2 items-center">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="https://public.overcast-cdn.com/art/2598591?v15" class="w-10 h-10" />

            <span class="truncate">CD100: The Disturbing Chainalysis Led Prosec</span>
        </div>
    </MenuItem>
</ul>