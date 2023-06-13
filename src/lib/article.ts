import { Readability, isProbablyReaderable } from '@mozilla/readability';
import type NDKLongForm from './ndk-kinds/long-form';

export async function fetchArticle(html: string, url: string, contentType: string): Promise<NDKLongForm | null> {
    // Fetch the HTML content of the URL and parse it with JSDOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, contentType as DOMParserSupportedType);

    // Check if the content is suitable for Readability
    if (!isProbablyReaderable(doc)) {
        throw new Error('The page is not reader-friendly.');
    }

    // Extract the main content using Readability
    const reader = new Readability(doc);
    const article: NDKLongForm | null = reader.parse() as NDKLongForm | null;

    if (!article) return null;

    article.url = url;

    return article;
}
