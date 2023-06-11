export async function load({ fetch, url }) {
    const loadUrl = url.searchParams.get('url');
    const response = await fetch(loadUrl);
    const contentType = response.headers.get('content-type').split(';')[0];
    const text = await response.text();
    return {
        text,
        contentType,
    };
}
