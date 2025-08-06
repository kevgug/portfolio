<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h1 class="text-glacial-blue">
    <span class="hidden md:inline">
      YC to Fortune 50. AI-Native Products.
    </span>
    <span class="inline md:hidden">
      YC to Fortune 50.<br />AI-Native Products.
    </span>
  </h1>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      Drove a 2x traffic increase for $30MM+ fintech and AI startups by
      strategically optimizing sitemaps and copy.
    </li>
    <li>
      Empowering designers to AI-generate Figma plugins at
      <a href="https://jpmorganchase.com">JPMorganChase</a> by providing a robust
      scaffold and automating version control.
    </li>
    <li>
      Secured 1st place at <a href="https://hyrox.com">Hyrox</a> U24 and won three
      national gold medals in UK school rowing, driven by an obsession with marginal
      gains.
    </li>
  </ul>
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Start a conversation",
        destination:
          "mailto:kevin@kevingugelmann.com?subject=Inquiry%20from%20kevingugelmann.com&body=Hi%20Kevin%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20was%20impressed%20by%20your%20work.%20I%27d%20like%20to%20start%20a%20conversation%20about%20a%20potential%20opportunity.%0A%0A%5BBriefly%20describe%20the%20role%20or%20project%20you%20have%20in%20mind%5D%0A%0ALooking%20forward%20to%20connecting.%0A%0ABest%2C%0A%5BYour%20Name%5D",
        mediaType: "none",
        eventName: "ctasection_ext_email_primary",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
  </div>
</div>
