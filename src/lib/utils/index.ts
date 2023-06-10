
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import {nip19} from 'nostr-tools';
import type { NDKFilter } from '@nostr-dev-kit/ndk';

export function nicelyFormattedSatNumber(amount: number) {
    // if the number is less than 1000, just return it
    if (amount < 1000) return amount;

    // if the number is less than 1 million, return it with a k, if the comma is not needed remove it
    if (amount < 1000000) return `${(amount / 1000).toFixed(1)}k`;

    // if the number is less than 1 billion, return it with an m
    if (amount < 1000000000) return `${(amount / 1000000).toFixed(1)}m`;

    return `${(amount / 100_000_000).toFixed(2)} btc`;
}

export function filterForId(id: string): NDKFilter {
    if (!!id.match(/:/)) {
        const [kind, pubkey, identifier] = id.split(':');
        return { kinds: [parseInt(kind)], authors: [pubkey], "#d": [identifier] };
    } else {
        return { ids: [id] };
    }
}

export function filterFromNaddr(naddr: string): NDKFilter {
    const ndecode = nip19.decode(naddr).data as any;

    return {
        kinds: [ndecode.kind],
        authors: [ndecode.pubkey],
        "#d": [ndecode.identifier],
    }
}

export function idFromNaddr(naddr: string) {
    const ndecode = nip19.decode(naddr).data as any;
    return `${ndecode.kind}:${ndecode.pubkey}:${ndecode.identifier}`;
}

export function prettifyContent(content: string) {
    const bitcoinImage = "<img src=\"https://abs.twimg.com/hashflags/Bitcoin_evergreen/Bitcoin_evergreen.png\" style=\"width: 1.2em; vertical-align: -20%; margin-right: 0.075em; height: 1.2em; margin-left: 2px; display: inline-block;\">";

    content = content
        .replace(/#bitcoin/i, `#bitcoin${bitcoinImage}`);

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        autolink: true,
        image: true
    });
    md.linkify?.set();
    content = md.render(content);

    return sanitizeHtml(content);
}

function flattenText(node: string) {
    const texts = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

    while (walker.nextNode()) {
        texts.push(walker.currentNode);
    }

    return texts;
}

export function highlightText(targetText: string, highlightId: string) {
    const regex = new RegExp(escapeRegExp(targetText), 'g');
    const textNodes = flattenText(document.body);
    const marks: HTMLElement[]  = [];

    textNodes.forEach((textNode) => {
        let match;
        let lastIndex = 0;

        while ((match = regex.exec(textNode.data)) !== null) {
            const mark = document.createElement('mark');
            mark.setAttribute('data-highlight-id', highlightId);
            const range = document.createRange();
            const startOffset = match.index;
            const endOffset = startOffset + targetText.length;

            if (lastIndex < startOffset) {
                const precedingTextNode = document.createTextNode(textNode.data.slice(lastIndex, startOffset));
                textNode.parentNode.insertBefore(precedingTextNode, textNode);
            }

            range.setStart(textNode, startOffset);
            range.setEnd(textNode, endOffset);
            range.surroundContents(mark);
            marks.push(mark);

            lastIndex = endOffset;
        }

        if (lastIndex < textNode.length) {
            const remainingTextNode = document.createTextNode(textNode.data.slice(lastIndex));
            textNode.parentNode.insertBefore(remainingTextNode, textNode);
        }

        textNode.remove();
    });

    return marks;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}

// Usage example: highlightText("your target text here");


// export function modifyDocument(content: string) {
//     const regex = new RegExp(content, 'gi');

//     // get all the text nodes in the current page
//     const textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

//     // loop through all the text nodes and replace the search string with the marked up version
//     for (let i = 0; i < textNodes.snapshotLength; i++) {
//         const node = textNodes.snapshotItem(i) as Text;
//         const parent = node.parentNode;

//         // check if the text node contains the search string
//         if (!node || !node.textContent || !node.textContent.match(regex)) {
//             continue;
//         }

//         const fragment = document.createDocumentFragment();
//         let match;

//         if (!node) continue;

//         // loop through all the matches in the text node
//         while ((match = regex.exec(node.textContent)) !== null) {
//             console.log({match, node});

//             const before = node.splitText(match.index);
//             const after = node.splitText(match[0].length);

//             console.log({before, after});


//             const mark = document.createElement("mark");

//             // append the matched text to the mark element
//             mark.appendChild(document.createTextNode(match[0]));

//             // append the mark element to the document fragment
//             fragment.appendChild(before);
//             fragment.appendChild(mark);

//             node = after;
//         }

//         // replace the original text node with the marked up version
//         parent.replaceChild(fragment, node);
//     }
// }
