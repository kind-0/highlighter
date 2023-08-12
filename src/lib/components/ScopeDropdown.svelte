<script lang="ts">
    import { currentUserFollowPubkeys, currentScope, currentUser } from '$lib/store';
    import { fetchFollowers } from '$lib/currentUser';

    export let scope: string;
    export let urlTemplate: string | undefined = undefined;

    let showScopeMenu = false;

    function urlFor(scope: string) {
        if (urlTemplate) {
            return urlTemplate.replace('<scope>', scope);
        } else {
            return "#";
        }
    }

    function select(e: Event, value: string) {
        scope = value;
        showScopeMenu = false;
        $currentScope.label = value;

        switch (value) {
            case 'network':
                if (!$currentUserFollowPubkeys) {
                    fetchFollowers()?.then(() => {
                        // update the filter
                        $currentScope.pubkeys = $currentUserFollowPubkeys || [];
                    });

                    return;
                } else {
                    // update the filter
                    $currentScope.pubkeys = $currentUserFollowPubkeys;
                }
                break;
            case 'personal':
                if ($currentUser?.hexpubkey()) {
                    $currentScope.pubkeys = [$currentUser?.hexpubkey()];
                } else {
                    $currentScope.pubkeys = [];
                }
                break;
            case 'global':
                $currentScope.pubkeys = undefined;
        }

        if (!urlTemplate) {
            e.preventDefault();
        }
    }

    function valueToText(value: string) {
        switch (value) {
            case 'personal':
                return 'Personal';
            case 'network':
                return `My Network`;
            case 'global':
                return 'Global';
            case 'curated':
                return 'Curated List [coming soon]';
        }
    }

    let options: string[] = [];

    const signedIn = [
        'personal',
        'network',
        'global',
        'curated'
    ];

    const signedOut = [
        'global',
        'curated'
    ];

    $: options = $currentUser ? signedIn : signedOut;
</script>

<div class="dropdown">
    <label tabindex="0" class="btn m-1 btn-neutral-focus rounded-lg">
        {valueToText(scope)}
        <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
    </label>

    <ul class="p-2 menu dropdown-content z-[1] rounded-box w-52 bg-base-300 text-base-300-content shadow-lg">
        {#each options as option}
            <li><a href={urlFor(option)} role="menuitem" tabindex="-1" on:click={(e)=>{select(e, option)}}>
                {valueToText(option)}
            </a></li>
        {/each}
    </ul>
</div>