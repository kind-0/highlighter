<div class="
    text-xl text-justify leading-loose
    overflow-auto
">
    <article>
        <slot />
    </article>
</div>

<style>
    :global(article h1) {
        font-weight: 600;
        font-size: 2rem;
        font-family: 'Montserrat', sans-serif;
        font-family: 'Outfit', sans-serif;
        margin-top: 1.5rem;
    }

    :global(article h2) {
        font-weight: 800;
        font-size: 1.75rem;
        font-family: 'Montserrat', sans-serif;
        font-family: 'Outfit', sans-serif;
        margin-top: 1.5rem;
        @apply text-zinc-700;
    }

    :global(article h3) {
        font-weight: 600;
        font-size: 1.5rem;
        font-family: 'Montserrat', sans-serif;
        font-family: 'Outfit', sans-serif;
        margin-top: 1.5rem;
    }

    :global(article p:not(:last-child)) {
        margin-bottom: 1rem;
    }

    :global(article blockquote) {
        font-family: var(--article-heading);
        font-size: 21px;
        overflow-wrap: break-word;
        padding: 0 0 0 50px;
        margin: 1.5rem 0;
    }

    :global(article ul) {
        list-style: disc;
        margin-left: 1.5rem;
    }

    :global(article a) {
        color:blueviolet;
    }

    :global(article img) {
        max-height: 420px !important;
        max-width: 100% !important;
        margin: 1rem auto;
    }

    :global(article mark) {
        color: black;
        padding: 1px;
    }
</style>