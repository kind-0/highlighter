<script>
    import SidebarMode from "$lib/components/Sidebar/SidebarMode.svelte";
    import Highlight from "$lib/icons/Highlight.svelte";
    import Relays from "$lib/icons/Relays.svelte";
    import { NDKKind } from "$lib/ndk-kinds";
    import { BookBookmark, Users } from "phosphor-svelte";
    import SidebarFolderTree from "./SidebarFolderTree.svelte";
    import RelaySetButton from "$lib/components/Sidebar/RelaySetButton.svelte";
    import SidebarUnsavedNotes from "$lib/components/Sidebar/SidebarUnsavedNotes.svelte";
</script>

<div class="flex flex-col gap-8">
    <SidebarMode />

    <ul class="menu bg-base-200 w-full rounded-box">
        <RelaySetButton />

        <SidebarUnsavedNotes />

        <SidebarFolderTree kinds={[NDKKind.HighlightList]}>
            <div slot="title">
                <li class="menu-title flex flex-row items-center">
                    <Highlight class="w-4 h-4 mr-2" />
                    HIGHLIGHTS
                </li>
            </div>
        </SidebarFolderTree>

        <SidebarFolderTree kinds={[NDKKind.GenericList]}>
            <div slot="title">
                <li class="menu-title flex flex-row items-center">
                    <BookBookmark class="w-4 h-4 mr-2" />
                    GENERIC
                </li>
            </div>
        </SidebarFolderTree>

        <SidebarFolderTree kinds={[NDKKind.UserList]}>
            <div slot="title">
                <li class="menu-title flex flex-row items-center">
                    <Users class="w-4 h-4 mr-2" />
                    PROFILES
                </li>
            </div>
        </SidebarFolderTree>

        <SidebarFolderTree kinds={[NDKKind.RelayList]}>
            <div slot="title">
                <li class="menu-title flex flex-row items-center">
                    <Relays class="w-4 h-4 mr-2" />
                    RELAY SETS
                </li>
            </div>
        </SidebarFolderTree>
    </ul>
</div>

