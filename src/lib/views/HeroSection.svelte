<script lang="ts">
  import CtaButton from "$lib/components/CtaButton.svelte";

  const atfPhone = "/images/atf-phone.png";
</script>

<div class="h-screen flex flex-row items-center">
  <img
    src={atfPhone}
    alt="A tilted iPhone showing Kevin's latest mobile app"
    class="hidden md:flex
    object-contain
    w-auto max-w-[15rem] lg:max-w-[18rem] xl:max-w-[25rem]
    h-2/3 min-h-[35rem]
    md:p-10 xl:p-14
    mr-2 lg:mr-4 xl:mr-8
    mb-2.5 lg:mb-4"
  />
  <div>
    <div>
      <h2
        class="text-glacialBlue uppercase 
      mb-2 md:mb-3"
      >
        Kevin Gugelmann
      </h2>
      <h1
        class="text-glacialBlue uppercase
      mb-8 xl:mb-12"
      >
        Digital Designer &<br />Front-End Developer
      </h1>
      <ul>
        <li>
          Self-driven student at the University of Chicago, studying Computer
          Science & Business Economics.
        </li>
        <li>Designing digital experiences for over 6 years.</li>
        <li>
          Conceptualizing and building meaningful software products using native
          and cross-platform technologies.
        </li>
      </ul>
    </div>
    <div class="mt-[4.5rem] lg:mt-[5.5rem] xl:mt-[7.5rem]" />
    <CtaButton label="View 6 projects" />
  </div>
</div>
