<script lang="ts">
    import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';
    import ndk from '$lib/stores/ndk';

    export let users: Set<string>;
    export let otherTopics: Set<string>;
    export let sortedOtherTopics: { topic: string; count: number }[];
</script>

{#if users && users.size > 0}
    <ul class="menu bg-base-200 w-full rounded-box">
        <li class="menu-title">PEOPLE</li>

        {#each Array.from(users) as npub}
            <li>
                <a href="/p/{npub}/highlights" class="flex flex-row items-center gap-2">
                    <Avatar {npub} ndk={$ndk} class="rounded-lg w-8" />
                    <Name {npub} ndk={$ndk} class="text-sm" on:click />
                </a>
            </li>
        {/each}
    </ul>
{/if}

{#if otherTopics && otherTopics.size > 0}
    <ul class="menu bg-base-200 w-full rounded-box">
        <li class="menu-title">RELATED TOPICS</li>

        {#each sortedOtherTopics as { topic, count }}
            <li>
                <a href="/highlights/t/{topic}" class="flex flex-row items-center justify-between gap-2">
                    <span>#{topic}</span>
                    <div class="badge badge-neutral">{count}</div>
                </a>
            </li>
        {/each}
    </ul>
{/if}