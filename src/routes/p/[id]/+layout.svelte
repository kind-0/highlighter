<script lang="ts">
    import { page } from "$app/stores";
    import WithLeftSidebar from "$lib/layouts/WithLeftSidebar.svelte";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import Sidebar from './Sidebar/Sidebar.svelte';
    import ndk from '$lib/stores/ndk';

    let npub: string;
    let prevNPub: string;
    let user: NDKUser;
    let fetchProfilePromise: Promise<void>;

    let bannerImage: string;
    const defaultBannerImage = 'https://nostr.build/i/nostr.build_e76387d298587c61e40913929eafe746ce6a780938750d21913a7b488228a146.webp';

    $: npub = $page.data.npub;

    $: if (npub !== prevNPub) {
        prevNPub = npub;

        user = $ndk.getUser({npub});
        fetchProfilePromise = new Promise((resolve) => {
            user.fetchProfile().then(() => {
                bannerImage = user.profile?.banner || defaultBannerImage;

                resolve();
            });
        });
    }
</script>

{#await fetchProfilePromise}
{:then}
    <div class="relative w-full h-64">
        <div
            class="absolute inset-0 w-full h-full bg-center bg-cover z-0"
            style={`background-image: url(${bannerImage})`}
        />
        <div
            class="absolute py-6 inset-0 w-full h-full bg-gradient-to-b from-black/50 to-black z-1"
        />

        <WithLeftSidebar containerClass="max-w-7xl" sidebarClass="lg:!w-80 xl:!w-80">
            <div slot="sidebar">
                <Sidebar {user} />
            </div>

            <slot />
        </WithLeftSidebar>
    </div>
{/await}