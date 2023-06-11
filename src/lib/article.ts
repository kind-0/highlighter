import {Readability, isProbablyReaderable } from '@mozilla/readability';

export async function fetchArticle(html: string, url: string, contentType: string): Promise<App.Article | null> {
    // Fetch the HTML content of the URL and parse it with JSDOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, contentType as DOMParserSupportedType);

    // Check if the content is suitable for Readability
    if (!isProbablyReaderable(doc)) {
        throw new Error("The page is not reader-friendly.");
    }

    // Extract the main content using Readability
    const reader = new Readability(doc);
    const article: App.Article | null = reader.parse() as App.Article | null;

    if (!article) return null;

    article.url = url;

    return article;
}
