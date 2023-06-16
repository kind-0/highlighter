<script lang="ts">
    import { Card } from "flowbite-svelte";

    export let articleId: string;
</script>

<Card>
    {articleId}
    {Date.now()}
</Card>