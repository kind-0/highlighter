<script lang="ts">
    import {Avatar, Name} from '@nostr-dev-kit/ndk-svelte-components';
    import ndk from '$lib/stores/ndk';
    import type { NDKUser } from '@nostr-dev-kit/ndk';
    import { Books, HighlighterCircle, Newspaper } from 'phosphor-svelte';
    import { page } from '$app/stores';
    import MenuItem from '$components/sidebars/MenuItem.svelte';

    export let user: NDKUser;

    const {id} = $page.params;

    let bio: string | undefined;

    $: bio = user.profile?.bio??user.profile?.about;
</script>

<ul class="menu bg-base-200 w-full rounded-box">
    <li class="border-b border-base-300 -mx-2 px-2">
        <div class="flex flex-row gap-4 items-center text-lg rounded-b-none hover:!bg-transparent hover:!cursor-default">
            <Avatar ndk={$ndk} {user} class="w-12 h-12 rounded-lg" />
            <Name ndk={$ndk} {user} class="text-lg font-semibold text-base-100-content" />
        </div>
    </li>
        <MenuItem
            href="/p/{id}/highlights"
            class="w-full"
            innerClass="flex flex-row items-center gap-2 flex-grow"
        >
            <HighlighterCircle weight="thin" class="w-8 h-8" />
            Highlights
        </MenuItem>
        <MenuItem
            href="/p/{id}/lists"
            class="w-full"
            innerClass="flex flex-row items-center gap-2 flex-grow"
        >
            <Books weight="thin" class="w-8 h-8" />
            Shelves
        </MenuItem>
        <MenuItem
            href="/p/{id}/articles"
            class="w-full"
            innerClass="flex flex-row items-center gap-2 flex-grow"
        >
            <Newspaper weight="thin" class="w-8 h-8" />
            Writing
        </MenuItem>
</ul>
