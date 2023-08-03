<script lang="ts">
    import { page } from "$app/stores";
    let currentPage: string;
    let currentMode: string;

    $: {
        currentPage = $page.url.pathname;

        if (currentPage.startsWith('/lists')) {
            currentMode = 'lists';
        } else if (currentPage.startsWith('/notes')) {
            currentMode = 'notes';
        } else {
            currentMode = 'highlights';
        }
    }
</script>

<div class="tabs tabs-boxed rounded-full gap-2 flex-nowrap mx-auto md:mx-0">
    <a href="/highlights/global/newest" class="tab"
    class:tab-active={currentMode === 'highlights'}>
        <span>Discover</span>
    </a>
    <a href="/lists" class="tab"
    class:tab-active={currentMode === 'lists'}>
        <span>Organise</span>
    </a>
    <a href="/notes" class="tab"
    class:tab-active={currentMode === 'notes'}>
        <span>Reflect</span>
    </a>
</div>

<style>
    .tab {
        @apply text-sm rounded-full h-10 font-semibold;
    }
    .tab-active {
        @apply from-gradient3 to-gradient4 bg-gradient-to-b;
        @apply p-0.5 flex flex-row;
    }

    .tab-active span {
        @apply block bg-base-100 rounded-full w-full transition whitespace-nowrap text-base-100-content;
        @apply px-4 py-3 flex-grow h-full flex flex-row items-center justify-center;
    }
</style>