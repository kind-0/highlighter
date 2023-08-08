import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export async function GET({url}) {
    const loadUrl = url.searchParams.get('url');
    const response = await fetch(loadUrl);
    let contentType = response.headers.get('content-type').split(';')[0];
    const text = await response.text();
    let res: any = { };

    if (loadUrl.startsWith('https://overcast.fm/+')) {
        contentType = 'embed/overcast';
        res = processOvercast(text);
    } else if (loadUrl?.startsWith('https://www.youtube.com/watch')) {
        contentType = 'embed/youtube';
        res = processYoutube(text);
    }

    res.contentType = contentType;

    return json(res);
}

function processYoutube(text: string): any {
    const res: any = { };
    const $ = cheerio.load(text);
    const metaTags: any = {};
    $('meta').each((index, element) => {
        const name = element.attribs.name;
        const content = element.attribs.content || element.attribs.value;

        if (name && content) {
            console.log({name, content});
            metaTags[name] = content;
        }
    });

    if (metaTags['title']) res.title = metaTags['title'];
    if (metaTags['description']) res.description = metaTags['description'];
    if (metaTags['twitter:image']) res.image = metaTags['twitter:image'];
    if (metaTags['twitter:player']) res.video = metaTags['twitter:player'];

    return res;
}

function processOvercast(text: string): any {
    const res: any = { };
    const $ = cheerio.load(text);
    const metaTags: any = {};
    $('meta').each((index, element) => {
        const name = element.attribs.name;
        const content = element.attribs.content || element.attribs.value;

        if (name && content) {
            metaTags[name] = content;
        }
    });

    if (metaTags['og:title']) res.title = metaTags['og:title'];
    if (metaTags['og:description']) res.description = metaTags['og:description'];
    if (metaTags['og:image']) res.image = metaTags['og:image'];
    if (metaTags['twitter:player:stream']) res.audio = metaTags['twitter:player:stream'];
    if (metaTags['twitter:player']) res.embed = metaTags['twitter:player'];

    return res;
}
