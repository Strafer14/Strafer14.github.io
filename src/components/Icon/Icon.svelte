<script lang="ts">
  import FaGithub from "svelte-icons/fa/FaGithub.svelte";
  import FaLinkedinIn from "svelte-icons/fa/FaLinkedinIn.svelte";
  import FaMediumM from "svelte-icons/fa/FaMediumM.svelte";
  import FaTwitch from "svelte-icons/fa/FaTwitch.svelte";
  import FaTwitter from "svelte-icons/fa/FaTwitter.svelte";
  import { IconTypes } from "./types";

  const iconMapping = {
    [IconTypes.TWITTER]: FaTwitter,
    [IconTypes.MEDIUM]: FaMediumM,
    [IconTypes.LINKED_IN]: FaLinkedinIn,
    [IconTypes.TWITCH]: FaTwitch,
    [IconTypes.GITHUB]: FaGithub,
  };

  export let chosenIcon: IconTypes;
  const ChosenIconComponent = iconMapping[chosenIcon];
</script>

<div class="icon">
  <ChosenIconComponent />
</div>

<style lang="scss">
  .icon {
    width: 20px;
    color: var(--light_blue);
    &:hover {
      color: white;
    }
  }
</style>
