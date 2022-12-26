<script lang="ts">
    import Paragraph from "../Paragraph/Paragraph.svelte";
    import Title from "../Title/Title.svelte";
    import { TitleSize } from "../Title/types";
  
    export let titleLabel: string;
    export let paragraphContent: string;
  </script>
  
  <div class="skill">
    <Title titleSize={TitleSize.MINOR}><span>{titleLabel}</span></Title>
    <Paragraph content={paragraphContent} />
  </div>
  
  <style lang="scss">
    .skill {
        display: flex;
        flex-direction: column;
        border-bottom: var(--border-definition);
    }
  </style>
  