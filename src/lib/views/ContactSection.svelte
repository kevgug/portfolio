<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Image from "$lib/components/Image.svelte";
  import headshotSrc from "$lib/images/kevin-gugelmann.jpg";
</script>

<div id="contact">
  <Image
    imgOptions={{
      src: headshotSrc,
      // avifSrc: headshotAvif,
      // webpSrc: headshotWebp,
      alt: "Kevin Gugelmann's headshot",
      loading: "eager",
    }}
    class="headshot rounded-full object-cover border border-white/30 mb-11"
  />
  <div>
    <h1 class="text-glacial-blue">
      <!-- Each line breaks at the width where it stops fitting: 374px, 307px -->
      <span class="flex flex-col gap-3.5 min-[375px]:gap-0">
        <span class="hidden min-[375px]:inline">Technology is neutral.</span>
        <span class="min-[375px]:hidden">Technology<br>is neutral.</span>
        <span class="hidden min-[310px]:inline">Design for net good.</span>
        <span class="min-[310px]:hidden">Design for<br>net good.</span>
      </span>
    </h1>
    <ul class="my-9 md:my-11 lg:my-12">
      <li>
        Built AI tooling at <a href="https://jpmorganchase.com">JPMorganChase</a> and full-stack products at <a href="https://www.freestyle.sh">Freestyle (YC S24)</a>.
      </li>
      <li>
        Studied Economics and Cognitive Science at the <a href="https://www.uchicago.edu">University of Chicago</a>.
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <PrimaryButton
        linkButtonContent={{
          label: "Book a call",
          destination: "https://cal.com/kevgug/intro",
          mediaType: "webpage",
          eventName: "ctasection_bookcall_primary",
          openInNewTab: true,
        }}
        variant="glacial"
      />
      <PrimaryButton
        linkButtonContent={{
          label: "Connect on LinkedIn",
          destination: "https://linkedin.com/in/kevingugelmann",
          mediaType: "none",
          eventName: "ctasection_linkedin_secondary",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
</div>

<style lang="postcss">
  :global(.headshot) {
    /* 4rem at 320px → 8rem at 1280px */
    --size: clamp(4rem, 6rem + 8.5vw, 12rem);
    width: var(--size);
    height: var(--size);
  }

  h1 {
    position: relative;
    font-size: 1.75rem;
  }
  @media (min-width: 360px) {
    h1 {
      font-size: calc(max(2rem, min(4rem, 7vw)));
    }
  }
  @media (min-width: 1536px) {
    h1 {
      font-size: 4rem;
    }
  }
</style>

