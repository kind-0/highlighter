<script lang="ts">
    import AvatarWithName from "$components/AvatarWithName.svelte";
    import { NDKList, type NDKEvent } from "@nostr-dev-kit/ndk";

    export let curation: NDKEvent;

    const list = NDKList.from(curation);
</script>

<div class="flex flex-col gap-4">
    <div class="card image-full h-64 w-48">
        <figure><img src="https://nostr.build/p/6KgW.png" /></figure>
        <div class="card-body">
            {list.name}
        </div>
    </div>


    <AvatarWithName
        class="flex-1"
        pubkey={curation.pubkey}
    />
</div>