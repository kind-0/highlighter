<script lang="ts">
    import ArticleEditor from "$lib/components/articles/editor/ArticleEditor.svelte";
    import NDKLongForm from "$lib/ndk-kinds/long-form";

    import ndk from "$lib/stores/ndk";
    import { onMount } from "svelte";

    import { page } from '$app/stores';
    import { currentUser } from "$lib/store";

    const { naddr } = $page.params;

    let event: NDKLongForm;
    let loadEvent: Promise<NDKLongForm>;

    let mounted = false;

    onMount(async () => {
        setTimeout(() => { mounted = true; }, 250);
    });

    $: if (mounted && !loadEvent && $currentUser && $ndk.signer) {
        loadEvent = new Promise(async (resolve, reject) => {
            console.log(`Fetching event ${naddr}`);
            const e = await $ndk.fetchEvent(naddr);

            console.log(e)

            if (!e) {
                reject("Event not found");
                return;
            }

            event = NDKLongForm.from(e);
            event.ndk = $ndk;

            if (e.kind === 31023) {
                let title = "";

                try {
                } catch (e) {}

                if (event.title) {
                    title = await $ndk.signer!.decrypt($currentUser!, event.title);
                }
                event.title = title;
                await event.decrypt($currentUser!, $ndk.signer!);
            }

            console.log('after decryption', event.rawEvent())

            resolve(event);
        });
    }
</script>

{#if loadEvent}
    {#await loadEvent then}
        {#if event.id}
            <ArticleEditor bind:event />
        {:else}
            <p>Event not found</p>
        {/if}
    {:catch e}
        <p>{e}</p>
    {/await}
{/if}