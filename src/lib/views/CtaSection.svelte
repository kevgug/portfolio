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
        YC to Fortune 50. I'm Kevin Gugelmann.
      </span>
      <span class="inline md:hidden">
        YC to Fortune 50.<br />I'm Kevin Gugelmann.
      </span>
    </h1>
    <ul class="my-9 md:my-11 lg:my-12">
      <li>
        Drove 2x traffic increase for $30MM+ fintech and AI startups by
        strategically optimizing sitemaps, design, and copy.
      </li>
      <li>
        Built an AI app builder toolkit for Figma plugins at
        <a href="https://jpmorganchase.com">JPMorganChase</a> that generates, runs,
        and git-manages production code through natural language prompts.
      </li>
      <li>
        Secured 1st place at <a href="https://hyrox.com">Hyrox</a> U24 and won three
        national gold medals in UK school rowing, driven by an obsession with marginal
        gains.
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <PrimaryButton
        linkButtonContent={{
          label: "Set up call",
          destination: "https://cal.com/kevgug/intro",
          mediaType: "none",
          eventName: "ctasection_ext_cal_primary",
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

