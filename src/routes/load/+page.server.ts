import { json } from '@sveltejs/kit';

export async function load({ fetch, url }) {
    const loadUrl = url.searchParams.get('url');
    console.log({loadUrl})
    const response = await fetch(loadUrl);
    let contentType = response.headers.get('content-type').split(';')[0];
    const text = await response.text();

    if (loadUrl.startsWith('https://overcast.fm/+')) {
        contentType = 'embed/overcast';
    } else if (loadUrl.startsWith('https://youtube.com/watch')) {
        contentType = 'embed/youtube';
    }

    return {
        text,
        contentType,
    };
}
