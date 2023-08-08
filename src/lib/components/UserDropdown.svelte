<script lang="ts">
    import CollapsableDropdown from '$lib/components/CollapsableDropdown.svelte';
    import Avatar from './Avatar.svelte';
    import { currentUser } from '$lib/store';
    import ndk from '$lib/stores/ndk';
    import GearIcon from '$lib/icons/Gear.svelte';
    import { logout } from '$lib/currentUser';
    import Notification from './Notification.svelte';
    import { Name } from '@nostr-dev-kit/ndk-svelte-components';
</script>

<CollapsableDropdown>
        <div slot="dropdown-button" class="btn btn-ghost btn-circle avatar">
            <Avatar
                ndk={$ndk}
                user={$currentUser}
                class="
                    border-2 border-base-300 rounded-full
                "
            />
        </div>

        <ul slot="dropdown-content" class="divide-y divide-neutral-800 menu p-0 w-[245px] rounded-box">
            <div>
                <div class="flex justify-between items-center menu-title px-[22px] py-[19px] gap-2">
                    <div class="w-0 flex flex-grow flex-row items-center gap-4">
                        <Avatar
                            ndk={$ndk}
                            user={$currentUser}
                            class="
                                w-8 h-8 border-2 border-base-300 rounded-full
                            "
                        />
                        <div class="text-center text-base text-base-100-content font-medium truncate">
                            <Name
                                ndk={$ndk}
                                user={$currentUser}
                                class="
                                "
                            />
                        </div>
                    </div>
                    <GearIcon />
                </div>
            </div>
            <div class="py-4 px-5 hidden">
                <span class="text-[10px] font-semibold tracking-widest">
                    NOTIFICATIONS
                </span>
                <div class="flex flex-row py-3 justify-between">
                    <!-- TODO UPDATE FUNCTIONAL NOTIFICATIONS COMPONENT -->
                    <Notification title={"Zaps"} notifications={6} />
                    <Notification title={"Likes"} />
                    <Notification title={"Comments"} />
                    <Notification title={"Unknown"} />
                </div>
            </div>
            <div class="p-[22px]">
                <div on:click={logout} class="btn btn-rounded-full rounded-full w-full h-11 bg-base-300">
                    <div class="text-center text-xs text-base-100-content font-medium normal-case">Log Out</div>
                </div>
            </div>
        </ul>

    </CollapsableDropdown>