<script lang="ts">
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Separator from "$lib/components/Separator.svelte";

  const atfPhone = "/images/atf-phone.png";
</script>

<div
  class="flex flex-col justify-between
        h-screen
        min-h-[34em] md:min-h-[44em] lg:min-h-[45em] xl:min-h-[47em]
        max-h-[52em] md:max-h-[54em] lg:max-h-[55em] xl:max-h-[57em]"
>
  <div><p class="pt-6">Header</p></div>
  <div class="flex flex-row items-center">
    <img
      src={atfPhone}
      alt="A tilted iPhone showing Kevin's latest mobile app"
      class="hidden md:flex 
            object-contain
            w-auto
            max-w-[15rem] lg:max-w-[16rem] xl:max-w-[16.5rem]
            min-h-[35rem]
            md:pr-10 xl:pr-12
            mr-2 lg:mr-4 xl:mr-8
            mb-2.5 lg:mb-4"
    />
    <div>
      <div>
        <h2
          class="text-glacial-blue uppercase 
                mb-2 md:mb-3"
        >
          Kevin Gugelmann
        </h2>
        <h1
          class="text-glacial-blue uppercase
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
            Conceptualizing and building meaningful software products using
            native and cross-platform technologies.
          </li>
        </ul>
      </div>
      <div
        class="mt-[4.5rem] lg:mt-[5.5rem]
              hidden md:flex"
      >
        <PrimaryButton label="View 6 projects" />
      </div>
    </div>
  </div>
  <div class="pb-separator-y">
    <!-- Show separator only on MD+ screens -->
    <div class="hidden md:flex">
      <Separator />
    </div>
    <!-- On small devices (i.e. phones) show scroll down arrow -->
    <div class="md:hidden">
      <button on:click={(e) => console.log("Scroll down")}>
        <svg
          id="Regular"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="13"
          width="13"
          ><defs /><title>arrow-down</title><line
            x1="12"
            y1="0.75"
            x2="12"
            y2="23.25"
            fill="none"
            stroke="#ffffff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5px"
          /><polyline
            points="1.5 12.75 12 23.25 22.5 12.75"
            fill-rule="evenodd"
            fill="none"
            stroke="#ffffff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5px"
          /></svg
        >
      </button>
    </div>
  </div>
</div>
