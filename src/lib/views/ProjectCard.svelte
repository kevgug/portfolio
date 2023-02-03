<script lang="ts">
  import Image from "$lib/components/Image.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";

  export let year: number;
  export let name: string;
  export let outputMedium: string;
  export let role: string;
  export let imgPath: string;
  export let imgAlt: string;
  export let description: string;
  export let builtWith: string[] | undefined;
  export let linkButtonContent: LinkButtonContent | undefined;
</script>

<div>
  <div class="flex flex-col md:flex-row justify-between">
    <div class="flex flex-col md:flex-row">
      <p
        class="font-semibold text-muted-text-grey 
              leading-none
              md:mr-4 xl:mr-4.5"
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
    <!-- Never shrinks -->
    <p
      class="text-muted-text-grey
            leading-none
            shrink-0 ml-0 md:ml-10 lg:ml-12
            mt-[0.64rem] md:mt-0"
    >
      {outputMedium} — {role}
    </p>
  </div>
  <div
    class="flex flex-col md:flex-row
          mt-8 md:mt-9 lg:mt-10
          p-7
          bg-gradient-to-b from-[#1E1E1E] to-[#1B1B1B]
          rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl"
  >
    <div class="flex justify-center">
      <Image
        src={imgPath}
        alt={imgAlt}
        class="max-h-full object-contain rounded-md"
      />
    </div>
    <div
      class="flex flex-col md:justify-between
            w-full md:min-w-[20em] md:max-w-[25em]
            mt-2 md:mt-0 md:pl-8
            mr-0.5 md:mr-1.5 xl:mr-2
            py-0.5 md:py-2"
    >
      {#if linkButtonContent}
        <!-- Always need top padding if there's a link -->
        <div class="h-5" />
      {:else}
        <!-- SM : Always need y padding between image and description -->
        <div class="h-5 md:h-0" />
      {/if}
      <!--  -->
      <div
        class="flex flex-col h-full justify-center
              my-0 md:my-10 lg:my-0"
      >
        <p class="font-serif text-description-text-grey">{description}</p>
        {#if builtWith}
          <div class="flex flex-wrap mt-5 md:mt-6 lg:mt-7">
            {#each builtWith as tool, i}
              <div class="flex flex-row">
                <p class="font-serif text-muted-text-grey">{tool}</p>
                {#if i != builtWith.length - 1}
                  <p class="font-serif text-muted-text-grey px-2">|</p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
      {#if linkButtonContent}
        <div
          class="flex justify-end h-5
              mt-14 md:mt-0"
        >
          <LinkButton {linkButtonContent} />
        </div>
      {:else}
        <!-- So that justify-between still centers description text (MD+) -->
        <div />
      {/if}
    </div>
  </div>
</div>
