<script lang="ts">
  import Qualification from "../../components/Qualification/Qualification.svelte";
  import QualificationLabel from "../../components/QualificationLabel/QualificationLabel.svelte";
  import Section from "../../components/Section/Section.svelte";
  import { capitalize } from "../../utils/helpers";

  let pageLabel = "experience";
</script>

<Section sectionName={pageLabel}>
  <div class={`${pageLabel}-wrapper`}>
    <QualificationLabel
      titleLabel={capitalize(pageLabel)}
      paragraphContent="I lead teams and develop applications. I take great pride in building great products and working with great people."
    />
    <div class="qualifications">
      <Qualification
        role="Full Stack Team Leader"
        organizationName="Zencity"
        timeRange="Mar, 2021 - Present"
        description="Lead and manage a team of full stack developers, set technical direction and strategy, and oversee the development and delivery of web applications. Manage project workload and contribute to the development of new technologies and processes. My role involves technical expertise, leadership, cooperation and project management skills."
      />
      <Qualification
        role="Full Stack Developer"
        organizationName="Zencity"
        timeRange="Jun, 2019 - Feb, 2021"
        description="Designed and maintained web applications using various technologies and frameworks. Worked with a team to deliver software solutions and contributed to the design and architecture of new systems. My role involved technical expertise, collaboration, innovation and problem-solving."
      />
      <Qualification
        role="Co-Founder and VP R&D"
        organizationName="Snipe"
        timeRange="Jan, 2017 - May, 2019"
        description="I co-founded an esports startup and worked closely with the CEO and other executives to align our research and development efforts with the overall business goals of the company. In this role, I developed various products using my skills in full stack development, data engineering, product management, and various other business disciplines."
      />
      <Qualification
        role="Data Developer Team Leader"
        organizationName="Israeli Military Intelligence - Unit 8200"
        timeRange="Feb, 2013 - Feb, 2016"
        description="Lead a department of Data Developers/Analysts, doing research and data mining in order to find patterns. Developing web solutions to handle the needs of high ranking decision makers."
      />
    </div>
  </div>
</Section>

<style lang="scss">
  .experience-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
</style>
