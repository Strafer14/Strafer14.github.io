<script lang="ts">
  import { TitleSize } from "./types";

  export let titleSize: TitleSize;
</script>

{#if titleSize === TitleSize.MAIN}
  <h1 class="title"><slot /></h1>
{:else if titleSize === TitleSize.SECONDARY}
  <h2 class="title"><slot /></h2>
{:else if titleSize === TitleSize.MINOR}
  <h4 class="title"><slot /></h4>
{/if}

<style lang="scss">
  .title {
    line-height: 1.25;
    font-weight: 700;
    font-family: var(--secondary_font);
  }
  h1 {
    margin: 0;
    &.title {
      font-size: 36px;
    }
  }
  h2 {
    margin: 0;
    &.title {
      font-size: 30px;
    }
  }
  h4 {
    margin: 0;
    &.title {
      font-size: 18px;
    }
  }
</style>
