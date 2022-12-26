<script lang="ts">
  import Skill from "../../components/Skill/Skill.svelte";
  import Section from "../../components/Section/Section.svelte";
  import QualificationLabel from "../../components/QualificationLabel/QualificationLabel.svelte";
  import { capitalize } from "../../utils/helpers";

  let pageLabel = "skills";
</script>

<Section sectionName={pageLabel}>
  <div class={`${pageLabel}-wrapper`}>
    <QualificationLabel
      titleLabel={capitalize(pageLabel)}
      paragraphContent="I am motivated by the opportunity to work with like-minded individuals who are passionate about creating something great."
    />
    <div class="skills">
      <Skill
        titleLabel="Backend Development"
        paragraphContent="Typescript, NodeJS, Deno, Rust, Python, Django, Express, NestJS."
      />
      <Skill
        titleLabel="Frontend Development"
        paragraphContent="HTML, CSS, SASS, Javascript, Typescript, Clojurescript, React, Svelte."
      />
      <Skill
        titleLabel="Project Management"
        paragraphContent="Planning and Organization, Risk Management, Leadership, Problem-solving, JIRA, Scrum."
      />
      <Skill
        titleLabel="Cloud Infrastructure & DevOps"
        paragraphContent="AWS, Azure, Terraform, Serverless, CircleCI, Gitlab CI/CD."
      />
    </div>
  </div>
</Section>

<style lang="scss">
  .skills-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
    .skills {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }
</style>
