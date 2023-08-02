import { NDKEvent, NDKUser, type NDKTag } from "@nostr-dev-kit/ndk";

export function createDraggableEvent(eventOrUser: NDKEvent | NDKUser) {
    function draggable(node: HTMLElement) {
        function handleDragStart(event: DragEvent) {
            if (!event.dataTransfer) return;

            if (eventOrUser instanceof NDKEvent) {
                event.dataTransfer.setData('id', eventOrUser.encode());
                event.dataTransfer.setData('kind', eventOrUser.kind!.toString());
                event.dataTransfer.setData('tag', JSON.stringify(eventOrUser.tagReference()));
            } else if (eventOrUser instanceof NDKUser) {
                event.dataTransfer.setData('id', eventOrUser.npub);
                event.dataTransfer.setData('tag', JSON.stringify(eventOrUser.tagReference()));
            }
        }

        node.addEventListener('dragstart', handleDragStart);
        node.setAttribute('draggable', 'true');

        return {
            destroy() {
                node.removeEventListener('dragstart', handleDragStart);
            }
        };
    }

    return draggable;
}