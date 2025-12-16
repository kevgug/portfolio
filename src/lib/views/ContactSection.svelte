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
    class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover border border-white/30 mb-11"
  />
  <div>
    <h1 class="text-glacial-blue">
      <span class="hidden md:inline">
        Cognitively sound design. For the AI age.
      </span>
      <span class="flex flex-col gap-3.5 min-[450px]:gap-0 md:hidden">
        <span class="hidden min-[450px]:inline">Cognitively sound design.</span>
        <span class="hidden min-[290px]:inline min-[450px]:hidden">Cognitively sound<br>design.</span>
        <span class="min-[290px]:hidden">Cognitively<br>sound design.</span>
        <span class="hidden min-[240px]:inline">For the AI age.</span>
        <span class="min-[240px]:hidden">For the<br>AI age.</span>
      </span>
    </h1>
    <ul class="my-9 md:my-11 lg:my-12">
      <li>
        Rewrote copy and doubled site traffic for a <a href="https://www.tradefinancedistribution.com">$4.5B trade finance initiative</a> in 3 weeks.
      </li>
      <li>
        Built an AI tool at
        <a href="https://jpmorganchase.com">JPMorganChase</a> that generates on-brand Figma plugins.
      </li>
      <li>
        Economics and Cognitive Science at the <a href="https://www.uchicago.edu">University of Chicago</a>.
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <PrimaryButton
        linkButtonContent={{
          label: "Discuss a project",
          destination: "https://cal.com/kevgug/intro",
          mediaType: "webpage",
          eventName: "ctasection_bookcall_primary",
          openInNewTab: true,
        }}
        variant="glacial"
      />
      <PrimaryButton
        linkButtonContent={{
          label: "Email me",
          destination: "mailto:kevin@kevingugelmann.com",
          mediaType: "none",
          eventName: "ctasection_email_secondary",
          openInNewTab: false,
        }}
      />
    </div>
  </div>
</div>

<style lang="postcss">
  h1 {
    position: relative;
    font-size: 1.75rem;
  }
  @media (min-width: 360px) {
    h1 {
      font-size: 2rem;
    }
  }
  @media (min-width: 768px) {
    h1 {
      font-size: calc(max(2rem, min(4rem, 4.5vw)));
    }
  }
  @media (min-width: 1536px) {
    h1 {
      font-size: 4rem;
    }
  }
</style>

