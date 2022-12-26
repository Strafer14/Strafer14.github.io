<script lang="ts">
  export let content: string;
</script>

<button>
  {content}
</button>

<style lang="scss">
  button {
    font-size: 12px;
    line-height: 1.66;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--secondary_font);
    color: #fff;
    -webkit-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
    min-width: 170px;
    text-align: center;
    padding: 15px;
    display: inline-block;
    border: none;
    border-radius: 2px;
    background-color: var(--purple_gray);
    cursor: not-allowed;
  }
</style>
