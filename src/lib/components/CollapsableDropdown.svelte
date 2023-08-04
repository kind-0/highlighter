<script lang="ts">
    import CloseIcon from '$lib/icons/Close.svelte';

    let hasFocus: boolean = false;

    async function toggleLogin() {
        if (hasFocus) {
            // Close dropdown
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
                hasFocus = false;
            }
            return
        }
        hasFocus = true;
        console.log("hasFocus:", hasFocus)
    }

</script>

<div class="dropdown {hasFocus ? 'dropdown-open': ''} dropdown-end">
    <label  tabindex="0" on:click={toggleLogin} on:blur={toggleLogin}>
        <div class="{hasFocus ? 'hidden' : 'transition duration-500 ease-out'} transition">
            <slot name="dropdown-button" />
        </div>
        <div class="{!hasFocus ? 'hidden' : ''} btn btn-rounded-full p-1 rounded-full border border-accent2 bg-base-200 {!hasFocus ? 'hover:bg-accent2' : 'hover:bg-base-200 hover:border-accent2 text-zinc-500 hover:text-zinc-300'} text-base-100-content hover:text-base-200 transition">
            <div class="px-2">
                <div class="btn-close w-6 h-6 rounded-full transition duration-300">
                    <CloseIcon />
                </div>
            </div>
        </div>
    </label>
    <div tabindex="0" class="dropdown-content z-[1]">
        <slot name="dropdown-content" />
    </div>
</div>
