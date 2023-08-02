import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export async function GET({url}) {
    const loadUrl = url.searchParams.get('url');
    const response = await fetch(loadUrl);
    let contentType = response.headers.get('content-type').split(';')[0];
    const text = await response.text();
    const res: any = { };

    console.log({loadUrl, contentType});


    if (loadUrl.startsWith('https://overcast.fm/+')) {
        contentType = 'embed/overcast';

        const $ = cheerio.load(text);
        const metaTags: any = {};
        $('meta').each((index, element) => {
            const name = element.attribs.name;
            const content = element.attribs.content || element.attribs.value;

            if (name && content) {
                metaTags[name] = content;
            }
        });

        console.log(metaTags);

        if (metaTags['og:title']) res.title = metaTags['og:title'];
        if (metaTags['og:description']) res.description = metaTags['og:description'];
        if (metaTags['og:image']) res.image = metaTags['og:image'];
        if (metaTags['twitter:player:stream']) res.audio = metaTags['twitter:player:stream'];
        if (metaTags['twitter:player']) res.embed = metaTags['twitter:player'];
    }

    res.contentType = contentType;

    return json(res);
}
