<script lang="ts">
  import Button from "../../components/Button/Button.svelte";
  import Icon from "../../components/Icon/Icon.svelte";
  import { IconTypes } from "../../components/Icon/types";
  import Paragraph from "../../components/Paragraph/Paragraph.svelte";
  import Section from "../../components/Section/Section.svelte";
  import Title from "../../components/Title/Title.svelte";
  import { TitleSize } from "../../components/Title/types";

  let yearsOfExperience = new Date().getFullYear() - 2015;
  let currentRole = "full stack team leader";
  let email = "michael@strafer.dev";
</script>

<Section sectionName="introduction">
  <div class="wrapper">
    <div class="information">
      <Title titleSize={TitleSize.MAIN}
        ><span>Hello, my name is Michael.</span></Title
      >
      <div class="paragraph-wrapper">
        <Paragraph
          content={`I am a ${currentRole}. I have over ${yearsOfExperience} years of experience in the field of software development and have a strong background in both front-end and back-end technologies. 
          I am skilled in leading cross-functional teams and have a track record of delivering high-quality software solutions on time and within budget. I am passionate about staying up-to-date with the latest industry trends and technologies, 
          and I am always looking for ways to improve my team's processes and productivity.`}
        />
      </div>
      <div class="contact-details">
        <span class="category-label">Email</span>
        <span>{email}</span>
        <span class="category-label">Location</span>
        <span>Tel-Aviv Area, Israel</span>
        <span class="category-label">Social</span>
        <span class="icons-wrapper">
          <a
            href="https://github.com/Strafer14"
            target="_blank"
            rel="noopener noreferrer"><Icon chosenIcon={IconTypes.GITHUB} /></a
          >
          <a
            href="https://twitter.com/Strafer15"
            target="_blank"
            rel="noopener noreferrer"><Icon chosenIcon={IconTypes.TWITTER} /></a
          >
          <a
            href="https://medium.com/@Strafer15"
            target="_blank"
            rel="noopener noreferrer"><Icon chosenIcon={IconTypes.MEDIUM} /></a
          >
          <a
            href="https://www.linkedin.com/in/michael-ostrovsky-010605108/"
            rel="noopener noreferrer"
            target="_blank"><Icon chosenIcon={IconTypes.LINKED_IN} /></a
          >
          <a
            href="https://www.twitch.tv/strafer14"
            target="_blank"
            rel="noopener noreferrer"><Icon chosenIcon={IconTypes.TWITCH} /></a
          >
        </span>
      </div>
      <div class="contact-actions">
        <Button content="download cv" />
      </div>
    </div>
    <img
      src="https://cdn.britannica.com/20/154120-050-78DE15C0/lemur.jpg"
      alt="lamoor"
    />
  </div>
</Section>

<style lang="scss">
  .paragraph-wrapper {
    max-width: 90%;
  }
  .wrapper {
    display: flex;
    img {
      width: 500px;
      height: 400px;
    }
    @media screen and (max-width: 924px) {
      img {
        display: none;
      }
    }
  }
  .contact-details {
    display: grid;
    grid-template-columns: 1fr 6fr;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 30px;
    .category-label {
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .icons-wrapper {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }
</style>
