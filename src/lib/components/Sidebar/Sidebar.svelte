<script>
    import SidebarFolders from "./SidebarFolders.svelte";
    import SidebarDropArea from "./SidebarDropArea.svelte";
    import MenuItem from './MenuItem.svelte';
    import SidebarMode from "./SidebarMode.svelte";
    import { sortedHighlightList, sortedUserList } from "$lib/stores/list";
    import { currentUser } from "$lib/store";
    import RelaySetButton from "./RelaySetButton.svelte";

    export let isHiddenSidebar = false;
</script>

<div class="flex flex-col items-center gap-8">
    <SidebarMode />

    <ul class="menu bg-base-200 w-full rounded-box">
        <RelaySetButton />

        <li class="menu-title">FEEDS</li>
        {#if $currentUser}
            <MenuItem href="/highlights/network/newest">
                My Network
            </MenuItem>
        {/if}
        <MenuItem href="/highlights/global/newest">
            Global
        </MenuItem>
        <MenuItem href="/highlights/explore">
            Explore
        </MenuItem>

        <SidebarFolders
            title="LISTS"
            list={sortedUserList}
            linkPrefix="/highlights/"
            linkSuffix="/newest"
        />

        <SidebarFolders title="SHELVES" list={sortedHighlightList} />
    </ul>
</div>
