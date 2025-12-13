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
        Cognitively sound design. For the AI era.
      </span>
      <span class="inline md:hidden">
        Cognitively sound design. <br />For the AI era.
      </span>
    </h1>
    <ul class="my-9 md:my-11 lg:my-12">
      <li>
        Economics and Cognitive Science at the <a href="https://www.uchicago.edu">University of Chicago</a>.
      </li>
      <li>
        Built an AI tool at
        <a href="https://jpmorganchase.com">JPMorganChase</a> that generates on-brand Figma plugins.
      </li>
      <li>
        Rewrote copy and doubled site traffic for a <a href="https://www.tradefinancedistribution.com">$4.5B trade finance initiative</a> in 3 weeks.
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <PrimaryButton
        linkButtonContent={{
          label: "View LinkedIn",
          destination: "https://linkedin.com/in/kevingugelmann",
          mediaType: "none",
          eventName: "ctasection_linkedin_primary",
          openInNewTab: true,
        }}
        variant="glacial"
      />
      <PrimaryButton
        linkButtonContent={{
          label: "Email",
          destination: "mailto:kevin@kevingugelmann.com",
          mediaType: "none",
          eventName: "ctasection_email_secondary",
          openInNewTab: false,
        }}
      />
    </div>
  </div>
</div>

