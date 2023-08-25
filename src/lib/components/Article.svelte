<div class="
    text-xl text-justify leading-loose
    overflow-auto w-full
">
    <article class={$$props.class??""}>
        <slot />
    </article>
</div>

<style lang="postcss">
    :global(article) {
    @apply font-serif;
}

:global(article h2) {
    @apply text-base-100-content;
}

:global(article h1) {
    font-weight: 600;
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    margin-top: 1.5rem;
}

:global(article h2) {
    font-weight: 800;
    font-size: 1.75rem;
    font-family: 'Montserrat', sans-serif;
    margin-top: 1.5rem;
    @apply text-zinc-700;
}

:global(article h3) {
    font-weight: 600;
    font-size: 1.5rem;
    font-family: 'Montserrat', sans-serif;
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
}

:global(article li) {
    margin-left: 1.5rem;
}

:global(article strong) {
    font-weight: 600;
}

:global(article a) {
    color: #FF685E;
}

:global(article img) {
    max-height: 420px !important;
    max-width: 100% !important;
    margin: 1rem auto;
}

:global(article pre) {
    @apply whitespace-normal;
}

:global(article mark) {
    color: black;
    padding: 1px;
    @apply transition duration-300;
}

:global(article.highlighter) {
    cursor: url(/images/highlight.svg) 0 30, auto;
}

:global(article mark[data-highlight-id]) {
    cursor: pointer;
    @apply transition-all duration-200;
}

:global(article mark:hover) {
    cursor: pointer;
    background: rgba(246, 48, 2, 0.8);
    color: #FFF0F0;
}
</style>