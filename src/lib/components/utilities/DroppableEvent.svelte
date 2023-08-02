<script lang="ts">
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { createEventDispatcher } from 'svelte';

    type validateFunction = (opts: {id: string, tag: NDKTag}) => boolean;

    export let validate: validateFunction = () => true;
    export let hoverClass: string = 'bg-zinc-300 border-dashed border-orange-500';

    const dispatch = createEventDispatcher();

    let dropZoneActive = false;

    function onDragEnter(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!e.dataTransfer) return;

        // set dropZoneActive if none of the tags have this id
        const data = parseDragData(e.dataTransfer);
        console.log({data});

        dropZoneActive = validate(data);
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!e.dataTransfer) return;

        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        if (validate({ id, tag })) {
            dispatch('drop', { id, tag });
        }
    }

    function parseDragData(dataTransfer: DataTransfer): { id: string, tag: NDKTag } {
        const dataString = dataTransfer.getData('application');
        console.log({dataString});

        if (!dataString || dataString === '') return;

        const { id, tag } = JSON.parse(dataString);

        return { id, tag };
    }
</script>

<div
    on:dragenter={onDragEnter}
    on:dragleave={() => dropZoneActive = false}
    on:drop={onDrop}
    ondragover="return false"
    class={`
        ${dropZoneActive ? hoverClass : ''}
        ${$$props.class}
    `}
>
    <slot />
</div>
