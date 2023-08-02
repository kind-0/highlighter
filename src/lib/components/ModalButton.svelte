<script lang="ts">
    import ButtonWithBorderGradient2 from "./buttons/ButtonWithBorderGradient2.svelte";
</script>

<ButtonWithBorderGradient2 on:click rounded="rounded-md"
    class="tracking-wider {$$props.class??''}"
    innerClass="bg-base-100"
>
    <slot />
</ButtonWithBorderGradient2>