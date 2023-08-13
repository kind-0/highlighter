<script lang="ts">
    import { currentUser } from '$lib/store';
    import ndk from '$stores/ndk';
    import { type NDKEvent } from '@nostr-dev-kit/ndk';

    let showText = false;

    function handleVideoEnd() {
        showText = true;
    }
</script>

Loading

<div class="loading-container">
    <video
        src="https://cdn.satellite.earth/57711fc56d66c417bed9f5191c23b112a1e75bb2c571a3be9b9c61af923bea78.mov"
        autoplay
        muted
        on:ended={handleVideoEnd}
    ></video>

    <div
        class="text-xl text-base-100-content transition-all duration-300"
        class:opacity-0={!showText}
        class:animate-pulse={showText}
    >
        Preparing your session
    </div>
</div>

<style>
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>