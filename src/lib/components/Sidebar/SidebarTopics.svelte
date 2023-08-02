<script lang="ts">
    import SectionTitle from "./SectionTitle.svelte";
</script>

<div class="flex flex-col gap-2">
    <SectionTitle title="TOPICS" reverse={true} />

    <ul class="flex flex-col gap-2 text-base w-full items-start text-base-300-content">
        <li><a href="/highlights/t/bitcoin">Bitcoin</a></li>
        <li><a href="/highlights/t/artificial-intelligence" class="text-white whitespace-nowrap">Artificial Intelligence</a></li>
    </ul>
</div>
