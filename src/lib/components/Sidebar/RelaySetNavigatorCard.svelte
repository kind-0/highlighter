<script lang="ts">
    import type NDKRelayList from "$lib/ndk-kinds/lists/relay-list";
    import RelaysIcon from "$lib/icons/Relays.svelte";
    import ButtonWithBorderGradient2 from "../buttons/ButtonWithBorderGradient2.svelte";
    import { changeRelaySet, currentRelaySet } from "$lib/components/RelaySets/index";
    import AvatarWithName from "../AvatarWithName.svelte";
    import EventCardDropdown from "../events/EventCardDropdown.svelte";

    export let relaySet: NDKRelayList

    function toggleRelaySet() {
        opened = !opened;
    }

    let opened = relaySet.name === 'New Relay List';
    let activeRelaySet: NDKRelayList | null = null;

    $: activeRelaySet = currentRelaySet();

    $: opened = activeRelaySet?.encode() === relaySet.encode();

    function connect(e: MouseEvent): void {
        changeRelaySet(relaySet);
    }
</script>

<div class="
    w-full flex-grow flex flex-col
    {opened ? 'row-span-2' : ''}
">
    <ButtonWithBorderGradient2 class="
        rounded-xl
        hover:bg-base-300
        transition duration-300
        card-compact
        {opened ? '' : '!p-0'}
    " on:click={toggleRelaySet}
        innerClass="hover:!bg-base-300 !text-base-content !font-normal !px-0"
    >
        <div class="card-body flex flex-col gap-4">
            <div class="flex flex-row gap-2">
                <RelaysIcon class="bg-base-300 w-12 h-12 p-2 text-base-100-content" />

                <div class="flex flex-col items-start">
                    <div class="card-title text-base-100-content">
                        {relaySet.name}

                        <EventCardDropdown event={relaySet} />
                    </div>
                    <div class="text-base-200-content truncate">
                        {relaySet.description??""}
                        <div class="text-xs">
                            <AvatarWithName
                                pubkey={relaySet.pubkey}
                                avatarClass="w-4 h-4"
                                nameClass="text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {#if opened}
                <ul class="flex flex-col items-start text-xs">
                    {#each relaySet.relays as relay (relay)}
                        <li>
                            {relay}
                        </li>
                    {/each}
                </ul>

                <div class="flex flex-row justify-end">
                    <ButtonWithBorderGradient2
                        rounded="rounded-full"
                        innerClass=""
                        on:click={connect}
                    >
                        Connect
                    </ButtonWithBorderGradient2>
                </div>
            {/if}
        </div>
    </ButtonWithBorderGradient2>
</div>