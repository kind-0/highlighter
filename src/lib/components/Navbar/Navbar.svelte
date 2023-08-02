<script lang="ts">
    import CurrentUser from '$lib/components/CurrentUser.svelte';
    import FullLogo from '$lib/icons/FullLogo.svelte';
    import RelaysButton from '$lib/components/RelaysButton.svelte';
    import SearchInput from './SearchInput.svelte';
    import Logo from '$lib/icons/Logo.svelte';
    import { currentUser } from '$lib/store';

    export let isHiddenSidebar = false;

    let homeLink = '/';

    $: homeLink = $currentUser ? `/highlights/network/newest` : '/';
</script>

<nav class="navbar bg-base-100 shrink-0 sticky top-0 z-20 py-4 lg:px-10 bg-base-100/80 justify-between gap-4">
    <div class="flex flex-row items-center sm:gap-4 navbar-start">
        <div class="flex-none {!isHiddenSidebar ? 'lg:hidden' : ''}">
            <label for="my-drawer" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"
                    ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg
                >
            </label>
        </div>

        <a href={homeLink}>
            <div class="flex flex-shrink-0 items-center">
                <div class="w-48 hidden sm:block"><FullLogo /></div>
                <div class="sm:hidden"><Logo /></div>
            </div>
        </a>
    </div>

    <div class="navbar-center w-1/2">
        <SearchInput />
    </div>

    <div class="navbar-end">
        <div class="dropdown dropdown-end hidden">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg
                >
            </label>
            <ul tabindex="0" class="menu menu-horizontal text-base dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box">
                <li><a href="/highlights/global/newest">Discover</a></li>
                <li><a href="/lists">Organize</a></li>
                <li><a href="/notes">Reflect</a></li>
            </ul>
        </div>
        <div class="flex items-center md:order-2 gap-4">
            <div class="hidden md:block">
                <RelaysButton iconOnly={true} />
            </div>
            <CurrentUser />
        </div>
    </div>
</nav>
