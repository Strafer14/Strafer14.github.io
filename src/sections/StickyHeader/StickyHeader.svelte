<script lang="ts">
  let shouldCastShadow = false;
  window.onscroll = function () {
    if (window.scrollY > 0) {
      shouldCastShadow = true;
    } else {
      shouldCastShadow = false;
    }
  };
</script>

<header class={shouldCastShadow ? "cast-shadow" : ""}>
  <div class="wrapper">
    <span class="logo">Michael</span>
    <div class="menu">
      <ul>
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#education">Education</a></li>
      </ul>
    </div>
  </div>
</header>

<style lang="scss">
  header {
    background-color: var(--dark_purple);
    padding: 20px 0 20px;
    top: 0;
    position: sticky;
    z-index: 1000;
    border-bottom: var(--border-definition);
    &.cast-shadow {
      box-shadow: 0 5px 10px RGB(209 211 224 / 10%);
      border-bottom-color: transparent;
    }
  }

  .logo {
    font-size: 24px;
    font-family: var(--secondary_font);
    font-weight: 700;
  }

  .menu {
    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      li {
        font-family: var(--secondary_font);
        margin: 8px 0 10px 20px;
        a {
          text-transform: uppercase;
          font-size: 12px;
          font-family: var(--secondary_font);
          font-weight: 700;
          line-height: 1.66;
          transition: all 0.3s ease;
          color: var(--light_blue);
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media screen and (max-width: 600px) {
      & {
        display: none;
      }
    }
  }

  .wrapper {
    padding-left: 10%;
    padding-right: 10%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>
