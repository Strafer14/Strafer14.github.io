<script lang="ts">
  import Qualification from "../../components/Qualification/Qualification.svelte";
  import QualificationLabel from "../../components/QualificationLabel/QualificationLabel.svelte";
  import Section from "../../components/Section/Section.svelte";
  import { capitalize } from "../../utils/helpers";

  let pageLabel = "education";
</script>

<Section sectionName={pageLabel}>
  <div class={`${pageLabel}-wrapper`}>
    <QualificationLabel
      titleLabel={capitalize(pageLabel)}
      paragraphContent="I am strongly motivated by my belief that education is important and always strive to learn something new on a daily basis."
    />
    <div class="skills">
      <Qualification
        role="Economics and Computer Science"
        organizationName="The Open University of Israel"
        timeRange="Feb, 2018 - Sep, 2025"
        description="Completing a Bachelor of Arts degree in Economics and Computer Science while working a full-time job. This requires me to balance my studies with my professional responsibilities."
      />
      <Qualification
        role="Various technical courses"
        organizationName="Israeli Military Intelligence - Unit 8200"
        timeRange="Feb, 2013 - Feb, 2016"
        description="Python development, PL/SQL, data analysis and more."
      />
    </div>
  </div>
</Section>

<style lang="scss">
  .education-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
</style>
