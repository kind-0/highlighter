<script lang="ts">
    import Avatar from '$lib/components/Avatar.svelte';
    import Name from '$lib/components/Name.svelte';
    import UserInterface from '$lib/interfaces/users';
    import type { Observable } from 'dexie';
  import { Card } from 'flowbite-svelte';

    export let pubkey: string | undefined;
    export let userProfile: App.UserProfile | undefined = undefined;
    export let subtitle: string | undefined = undefined;
    let prevPubkey: string | undefined = undefined;
    let observeUserProfile: Observable<App.UserProfile> | undefined = undefined;

    $: {
        if (pubkey !== prevPubkey && !userProfile) {
            prevPubkey = pubkey;
            observeUserProfile = UserInterface.get({ hexpubkey: pubkey });
        }

        if (observeUserProfile && $observeUserProfile) {
            userProfile = ($observeUserProfile||{}) as App.UserProfile;
        }
    }
</script>

<Card class="group block flex-shrink-0">
    <div class="flex flex-row gap-3.5 items-center">
        <div class="">
            <Avatar {userProfile} />
        </div>
        <div class="w-4/5">
            <p class="text-base font-medium text-gray-700 group-hover:text-gray-900">
                <Name {userProfile} />
            </p>

            {#if subtitle || userProfile?.about}
                <p class="text-sm font-medium text-gray-500 group-hover:text-gray-700 truncate">
                    {subtitle || userProfile?.about}
                </p>
            {/if}
        </div>
    </div>

    {#if $$slots.right}
        <div class="flex items-center justify-end">
            <slot name="right" />
        </div>
    {/if}
</Card>