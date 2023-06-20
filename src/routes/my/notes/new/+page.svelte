<script lang="ts">
    import ArticleEditor from "$lib/components/articles/editor/ArticleEditor.svelte";
    import NDKLongForm from "$lib/ndk-kinds/long-form";

    import ndk from "$lib/stores/ndk";

    let event = new NDKLongForm($ndk);
</script>

<ArticleEditor bind:event />
