<script>
    import SidebarFolders from "../Sidebar/SidebarFolders.svelte";
    import MenuItem from './MenuItem.svelte';
    import { sortedHighlightList, sortedUserList } from "$lib/stores/list";
    import { currentUser } from "$lib/store";
    import { user, userFollowHashtags } from "$stores/session";
    import ReaderIcon from "$icons/ReaderIcon.svelte";
    import SectionLink from "../Sidebar/SectionLink.svelte";
    import Highlight from "$icons/Highlight.svelte";
    import CardWithTitle from "$components/cards/CardWithTitle.svelte";
    import Hashtag from "$icons/Hashtag.svelte";
    import RelaySetButton from "$components/Sidebar/RelaySetButton.svelte";
</script>

<div class="flex flex-col items-center gap-8">
    <SectionLink
        href="/reader"
        title="Reader"
    >
        <span slot="icon"><ReaderIcon class="w-6 h-6 text-accent2" /></span>
    </SectionLink>

    <CardWithTitle
        icon={Highlight}
        iconClass="text-accent w-5 h-5"
        title="Highlighter"
    >
        <ul class="menu bg-base-200 w-full rounded-box">
            <RelaySetButton />
            <li class="menu-title">PROFILES</li>
            {#if $currentUser}
                <MenuItem href="/highlights/me" activeClass="border-l-accent">
                    Just you
                </MenuItem>
                <MenuItem href="/highlights" activeClass="border-l-accent">
                    Following
                </MenuItem>
            {/if}
            <MenuItem href="/highlights/global/newest" activeClass="border-l-accent">
                Local
            </MenuItem>

            {#if $sortedUserList}
                {#each $sortedUserList as user}
                    <MenuItem href="/highlights/{user.id}/newest" activeClass="border-l-accent">
                        {user.name}
                    </MenuItem>
                {/each}
            {/if}

            {#if $userFollowHashtags && $userFollowHashtags.length > 0}
                <li class="menu-title">TOPICS</li>
                {#each $userFollowHashtags as hashtag}
                    <MenuItem
                        href="/highlights/t/{hashtag}"
                        activeClass="border-l-accent"
                        innerClass="flex flex-row gap-2"
                    >
                        <Hashtag class="w-6 h-6 !text-base-300-content" />
                        {hashtag}
                    </MenuItem>
                {/each}
            {/if}

            <SidebarFolders
                title="LISTS"
                list={sortedUserList}
                linkPrefix="/highlights/"
                linkSuffix="/newest"
            />

            <SidebarFolders title="SHELVES" list={sortedHighlightList} />
        </ul>
    </CardWithTitle>
</div>

<style>
    :global(* > li a.active) {
        font-weight: black !important;
    }
</style>