import { NDKEvent, NDKUser, type NDKTag } from "@nostr-dev-kit/ndk";
import type { Action } from "@sveltejs/kit";

export function createDraggableEvent(eventOrUser: NDKEvent | NDKUser) {
    function draggable(node: HTMLElement) {
      // Function to handle the dragstart event
        function handleDragStart(event: Event) {
            if (eventOrUser instanceof NDKEvent) {
                event.dataTransfer.setData('id', eventOrUser.encode());
                event.dataTransfer.setData('kind', eventOrUser.kind!.toString());
                event.dataTransfer.setData('tag', JSON.stringify(eventOrUser.tagReference()));
            } else if (eventOrUser instanceof NDKUser) {
                event.dataTransfer.setData('id', eventOrUser.npub);
                event.dataTransfer.setData('tag', JSON.stringify(eventOrUser.tagReference()));
            }
        }

        // Add event listener for dragstart
        node.addEventListener('dragstart', handleDragStart);
        node.setAttribute('draggable', 'true');

      // Cleanup function to remove the event listener
        return {
            destroy() {
                node.removeEventListener('dragstart', handleDragStart);
            }
        };
    }

    return draggable;
}