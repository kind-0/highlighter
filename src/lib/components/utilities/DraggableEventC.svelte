<script lang="ts">
    import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import  { dropped }  from './dropstore'

    export let event: NDKEvent;
    export let element: HTMLElement;
    export let list: NDKList;
   
    
    let drop_zone: { offsetLeft: any; offsetTop: any; offsetWidth: any; offsetHeight: any };
    let status = '';
    let dropped_in = false;
    let activeEvent = '';
    let originalX = '';
    let originalY = '';

    $: console.log("dropped! in drag...", $dropped)
    function handleDragEnter(e) {
        status = "You are dragging over the " + e
            .target
            .getAttribute('id');
    }

    function handleDragLeave(e) {
        status = "You left the " + e
            .target
            .getAttribute('id');
    }

    function handleDragDrop(e) {
        e.preventDefault();
        var element_id = e
            .dataTransfer
            .getData("text");
				$dropped = element_id;
        dropped_in = true;
        status = "You droped " + element_id + " into drop zone";
        addToList(e);
    }


    async function addToList(e: DragEvent) {
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));
        console.log('add to list event. id, tag:', id, tag);
        if (list.tags.find((t) => t[1] === id)) {
            return;
        }

        list.tags.push(tag);
        list.created_at = Math.floor(Date.now() / 1000);
        await list.sign();
        list.publish();
    }

    function handleDragStart(e) {
        const id = e.dataTransfer.getData('id');
        const tag = JSON.parse(e.dataTransfer.getData('tag'));

        console.log('in handleDRAGSTART: add to list event. id, tag:', id, tag);

        status = 'Dragging the element ' + e.target.getAttribute('id');
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('text', e.target.getAttribute('id'));
    }

    function handleDragEnd(e) {
        if (dropped_in == false) {
            status = 'You let the ' + e.target.getAttribute('id') + ' go.';
        }
        dropped_in = false;
    }

    function handleTouchStart(e) {
        status = 'Touch start with element ' + e.target.getAttribute('id');
        originalX = e.target.offsetLeft - 10 + 'px';
        originalY = e.target.offsetTop - 10 + 'px';
        activeEvent = 'start';
    }

    function handleTouchMove(e) {
        let touchLocation = e.targetTouches[0];
        let pageX = Math.floor(touchLocation.pageX - 50) + 'px';
        let pageY = Math.floor(touchLocation.pageY - 50) + 'px';
        status = 'Touch x ' + pageX + ' Touch y ' + pageY;
        e.target.style.position = 'absolute';
        e.target.style.left = pageX;
        e.target.style.top = pageY;
        activeEvent = 'move';
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (activeEvent === 'move') {
            let pageX = parseInt(e.target.style.left) - 50;
            let pageY = parseInt(e.target.style.top) - 50;

            if (detectTouchEnd(drop_zone.offsetLeft, drop_zone.offsetTop, pageX, pageY, drop_zone.offsetWidth, drop_zone.offsetHeight)) {
                $dropped = element;
                e.target.style.position = 'initial';
                dropped_in = true;
                status = 'You dropped ' + e.target.getAttribute('id') + ' into drop zone';
            } else {
                e.target.style.left = originalX;
                e.target.style.top = originalY;
                status = 'You let the ' + e.target.getAttribute('id') + ' go.';
            }
        }
    }

    function detectTouchEnd(x1, y1, x2, y2, w, h) {
        //Very simple detection here
        if (x2 - x1 > w) return false;
        if (y2 - y1 > h) return false;
        return true;
    }
</script>


<div 
	on:dragenter={handleDragEnter} 
	on:dragleave={handleDragLeave}  
	on:drop={handleDragDrop} 
	bind:this={drop_zone} 
	id="drop_zone" 
	ondragover="return false"
>
	{#each objects.filter(v => dropped.includes(`${v.id}`)) as {id}, i}
	
		<div class="objects" id={id} style="cursor: auto">
			Object {id}dd
		</div>
	
	{/each}
</div>


<div
    id={event.tagId()}
    class="objects"
    draggable="true"
    bind:this={element}
    on:dragstart={handleDragStart}
    on:dragend={handleDragEnd}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
>
<h2 id="app_status">Drag status: {status}</h2>
    <slot />
</div>
