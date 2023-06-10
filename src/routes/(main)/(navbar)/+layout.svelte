<script lang="ts">
    import Navbar from './components/Navbar.svelte';
</script>

<div class="min-h-full">

    <Navbar />

    <div class="py-10">
        <main>
            <div class="mx-auto max-w-7xl px-2 sm:px-4">
                <slot />
            </div>
        </main>
    </div>
</div>
