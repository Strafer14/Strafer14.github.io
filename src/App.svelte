<script lang="ts">
  import Education from "./sections/Education/Education.svelte";
  import Experience from "./sections/Experience/Experience.svelte";
  import Footer from "./sections/Footer/Footer.svelte";
  import Introduction from "./sections/Introduction/Introduction.svelte";
  import Skills from "./sections/Skills/Skills.svelte";
  import StickyHeader from "./sections/StickyHeader/StickyHeader.svelte";
</script>

<body>
  <StickyHeader />
  <Introduction />
  <Skills />
  <Experience />
  <Education />
  <Footer />
</body>

<style>
</style>
