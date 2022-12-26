<script lang="ts">
  import Paragraph from "../Paragraph/Paragraph.svelte";
  import Title from "../Title/Title.svelte";
  import { TitleSize } from "../Title/types";

  export let titleLabel: string;
  export let paragraphContent: string;
</script>

<div class="qualification-label-wrapper">
  <Title titleSize={TitleSize.SECONDARY}><span>{titleLabel}</span></Title>
  <Paragraph content={paragraphContent} />
</div>

<style lang="scss">
  .qualification-label-wrapper {
    max-width: 90%;
  }
</style>
