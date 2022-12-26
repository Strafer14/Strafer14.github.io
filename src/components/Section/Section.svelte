<script lang="ts">
  export let sectionName: string;
</script>

<section id={sectionName}>
  <div class="content">
    <slot />
  </div>
</section>

<style lang="scss">
  section {
    scroll-margin-top: 117px;
    padding: 40px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-bottom: var(--border-definition);
    .content {
        padding: 40px 10%;
    }
  }
</style>
