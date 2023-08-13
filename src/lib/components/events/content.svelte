<script lang="ts">
    import GenericEventCard from '$lib/components/events/generic/card.svelte';
    import Name from '$lib/components/Name.svelte';
    import { parseContent } from '$lib/nip27';
    export let note: string;
    export let tags: any[];
    export let addNewLines: boolean = true;
    let notePrev: string;

    const links = []
    const entities = []
    const ranges = []

    let anchorId;
    let content;

    $: if (note && note?.length !== notePrev?.length) {
        notePrev = note;

        content = parseContent(note||"", tags);

        // Find links and preceding whitespace
        for (let i = 0; i < content.length; i++) {
            const {type, value} = content[i]

            if (
                (type === "link" && !value.startsWith("ws")) ||
                ["nostr:note", "nostr:nevent"].includes(type)
            ) {
                if (type === "link") {
                    links.push(value)
                } else if (value.id !== anchorId) {
                    entities.push({type, value})
                }

                const prev = content[i - 1]
                const next = content[i + 1]

                if ((!prev || prev.type === "newline") && (!next || next.type === "newline")) {
                    let n = 1
                    for (let j = i - 1; ; j--) {
                        if (content[j]?.type === "newline") {
                            n += 1
                        } else {
                            break
                        }
                    }

                    ranges.push({i: i + 1, n})
                }
            }
        }
    }

    type Entity = { type: string, value: any };

    function groupInParagraphs(content: Entity[]) {
        const paragraphs: Entity[][] = [];
        let currentParagraph: Entity[] = [];

        for (let i = 0; i < content.length; i++) {
            let {type, value} = content[i];
            if (typeof value === 'string') value = value.replace(/(<p>|<\/p>)/i, '')

            switch (type) {
                case 'newline':
                    if (addNewLines) {
                        paragraphs.push(currentParagraph);
                        currentParagraph = [];
                    }
                    break;
                case 'text':
                case 'link':
                case 'topic':
                case 'nostr:npub':
                case 'nostr:nprofile':
                    currentParagraph.push({type, value});
                    break;
                case 'nostr:note':
                case 'nostr:nevent':
                case 'nostr:naddr':
                    paragraphs.push(currentParagraph);
                    paragraphs.push([ {type, value} ]);
                    currentParagraph = [];
                    break;
                default:
                    currentParagraph.push({type, value});
                    break;
            }
        }

        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph);
        }

        return paragraphs;
    }
</script>

<!-- text-black -->
<div class="
    h-full flex flex-col sm:text-justify gap-2.5
    overflow-auto
">
    {#if content}
        {#each groupInParagraphs(content) as paragraphItems}
            <p>
                {#each paragraphItems as { type, value }, i}
                    {#if type === "newline"}
                        {#each value as _}
                            <!-- {#if addNewLines} -->
                                <br />
                            <!-- {/if} -->
                        {/each}
                    {:else if type === "link"}
                        <!-- if it looks like this URL ends with an image filetype, load it as an image -->
                        {#if value.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)}
                            <img src="{value}" />
                        {:else}
                            <a href="{value}" target="_blank" rel="noopener noreferrer">
                                {value.replace(/https?:\/\/(www\.)?/, "")}
                            </a>
                        {/if}
                    {:else if type.startsWith("nostr:")}
                        {#if value.entity.startsWith('npub')}
                            <a href="/p/{value.entity}" class="text-accent">
                                <Name pubkey={value.id} />
                            </a>
                        {:else if value.entity.startsWith('nprofile')}
                            <a href="/p/{value.entity}" class="text-accent">
                                <Name pubkey={value.pubkey} />
                            </a>
                        {:else}
                            <div class="embedded-card text-sm">
                                <GenericEventCard
                                    bech32={value.entity}
                                    skipReplies={true}
                                    embeddedMode={true}
                                />
                            </div>
                        {/if}
                    {:else if type === "topic"}
                        <a href="/highlights/t/{value}" class="text-accent font-semibold">
                            #{value}
                        </a>
                    {:else}
                        {@html value}
                    {/if}
                {/each}
            </p>
        {/each}
    {:else}
    {/if}
</div>
