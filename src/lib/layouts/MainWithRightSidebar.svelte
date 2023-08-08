<script lang="ts">
</script>

<div class="
    flex flex-col md:flex-row space-y-32 md:space-y-0 md:space-x-32
">
    <main class="w-full md:w-1/2 lg:w-main overflow-x-auto">
        <slot />
    </main>

    <aside class="sticky top-8 hidden shrink-0 md:block w-sidebar">
        <slot name="right-sidebar" />
    </aside>
</div>


