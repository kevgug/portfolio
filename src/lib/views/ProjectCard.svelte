<script lang="ts">
  import LinkButton from "$lib/components/LinkButton.svelte";
  import type { ProjectLinkContent } from "$lib/util/projectLinkContent";

  export let year: string;
  export let name: string;
  export let outputMedium: string;
  export let role: string;
  export let imgPath: string;
  export let imgAlt: string;
  export let description: string;
  export let linkButtonContent: ProjectLinkContent;
</script>

<div class="flex flex-col md:flex-row justify-between">
  <div class="flex flex-col md:flex-row">
    <p
      class="font-semibold text-muted-text-grey 
	  leading-none
	  md:mr-3 lg:mr-3.5 xl:mr-4"
    >
      {year}
    </p>
    <!-- MD+ : Align top of h2 with p's -->
    <h2
      class="text-xl md:text-2xl lg:text-3xl font-semibold
	leading-none
	mt-[0.52rem] md:mt-[-0.145rem] lg:mt-[-0.21rem]"
    >
      {name}
    </h2>
  </div>
  <p
    class="text-muted-text-grey
	leading-none
	mt-[0.76rem] md:mt-0"
  >
    {outputMedium} – {role}
  </p>
</div>
<div
  class="flex flex-col md:flex-row
  my-8
  p-7
bg-gradient-to-b from-[#1E1E1E] to-[#1B1B1B]
rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl"
>
  <div class="flex justify-center">
    <img src={imgPath} alt={imgAlt} class="max-h-full object-contain" />
  </div>
  <div
    class="flex flex-col md:justify-between
  w-full md:min-w-[20em] md:max-w-[25em]
  mt-2 md:mt-0 md:pl-8
  mr-0.5 md:mr-1.5
  mb-0.5 md:mb-2"
  >
    <div class="h-5" />
    <p class="font-serif text-description-text-grey">{description}</p>
    <div
      class="flex justify-end h-5
	mt-14 md:mt-0"
    >
      <LinkButton {...linkButtonContent} openInNewTab />
    </div>
  </div>
</div>
