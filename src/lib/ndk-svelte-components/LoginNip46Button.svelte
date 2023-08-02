<script lang="ts">
    import { openModal } from 'svelte-modals';
    import LoginNip46Modal from './LoginNip46Modal.svelte';

    async function openNip46Modal() {
        // Close dropdown
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        openModal(LoginNip46Modal);
    }
</script>

<div on:click={openNip46Modal} class="btn btn-rounded-full rounded-full w-full h-11 bg-base-300">
    <div class="text-center text-xs font-medium normal-case">nsecBunker</div>
</div>
