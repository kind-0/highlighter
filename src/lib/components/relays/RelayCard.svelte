<script lang="ts">
    import { onMount } from "svelte";
    import AvatarWithName from "../AvatarWithName.svelte";

    export let relayUrl: string;

    type RelayInfoDoc = {
        name?: string;
        description?: string;
        pubkey?: string;
        contact?: string;
        supported_nips?: string[];
        software?: string;
        version?: string;
    }

    let relayInfo: RelayInfoDoc;

    onMount(() => {
        // fetch relayUrl, replacing wss:// with https:// with Accept: application/nostr+json
        fetch(relayUrl.replace('wss://', 'https://'), {
            headers: {
                'Accept': 'application/nostr+json'
            }
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Failed to fetch relay info: ${res.status} ${res.statusText}`);
            }
        }).then((json) => {
            relayInfo = json;
        }).catch((err) => {
            console.error(err);
        });
    })

    function dragStart(e: DragEvent) {
        if (!e.dataTransfer) return;

        const tag = ['r', relayUrl];

        e.dataTransfer.setData('tag', JSON.stringify(tag));
    }
</script>

<div class="card card-bordered {$$props.class}" draggable={true} on:dragstart={dragStart}>
    <div class="card-body">
        <h5 class="card-title text-base-100-content">
            {relayInfo?.name ?? relayUrl}
        </h5>

        {#if relayInfo}
            {#if relayInfo.description}
                <p class="">
                    {relayInfo.description}
                </p>
            {/if}

            {#if relayInfo.pubkey}
                <AvatarWithName pubkey={relayInfo.pubkey} avatarClass="w-12 h-12" />
            {/if}

            {#if relayInfo.supported_nips}
                <p class="">
                    Supported NIPs: {relayInfo.supported_nips.join(', ')}
                </p>
            {/if}

            <div class="text-accent font-semibold">{relayUrl}</div>
        {/if}
    </div>
</div>
