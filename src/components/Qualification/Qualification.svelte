<script lang="ts">
  import Paragraph from "../Paragraph/Paragraph.svelte";
  import Title from "../Title/Title.svelte";
  import { TitleSize } from "../Title/types";

  export let role: string;
  export let organizationName: string;
  export let description: string;
  export let timeRange: string;
</script>

<div class="qualification">
  <div class="role-metadata">
    <Title titleSize={TitleSize.MINOR}>
      <span>
        {role}
      </span>
    </Title>
    <span class="organization-name">{organizationName}</span>
  </div>
  <span class="time-range">{timeRange}</span>
  <Paragraph content={description} />
</div>

<style lang="scss">
  .qualification {
    display: flex;
    flex-direction: column;
    border-bottom: var(--border-definition);
    margin-bottom: 20px;
    .role-metadata {
      display: flex;
      gap: 10px;
    }
  }
</style>
