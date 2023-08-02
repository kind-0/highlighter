<script lang="ts">
</script>

<div class="flex flex-col-reverse lg:flex-row gap-9">
    <main class="flex-grow">
        <slot />
    </main>

    <aside class="sticky top-8 hidden shrink-0 md:block w-72">
        <slot name="right-sidebar" />
    </aside>
</div>


