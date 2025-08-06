<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h1 class="text-glacial-blue">
    <span class="hidden md:inline">
      YC to Fortune 50. AI-Native Software.
    </span>
    <span class="inline md:hidden">
      YC to Fortune 50.<br />AI-Native Software.
    </span>
  </h1>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      From designing websites at <a href="https://freestyle.sh"
        >Freestyle (YC S24)</a
      >
      to coding 500x faster plugins at
      <a href="https://jpmorganchase.com">JPMorganChase</a>, I turn user needs
      into enterprise-grade products.
    </li>
    <li>
      I bring relentless drive to everything, winning 3 UK school rowing gold
      medals and doubling traffic for two $30MM+ startups.
    </li>
    <li>
      I'm currently fascinated by QA automation and voice-first language
      learning.
    </li>
  </ul>
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Let's build together",
        destination:
          "mailto:kevin@kevingugelmann.com?subject=Let's%20collaborate%20on%20%5BProject%20name%5D&body=Hi%20Kevin%2C%0A%0AI%27m%20reaching%20out%20about%20a%20potential%20collaboration%20in%20UX%20engineering.%20Here%27s%20what%20I%27m%20looking%20for%3A%0A%0A%5BDescribe%20your%20project%20%E2%80%94%20landing%20page%2C%20full%20stack%20help%2C%20startup%20role%2C%20etc.%5D%0A%0AWhy%20I%20think%20you%27d%20be%20a%20great%20fit%3A%0A%0A%5BShare%20your%20thoughts%5D%0A%0ALooking%20forward%20to%20connecting!%0A%0ABest%2C%0A%5BYour%20Name%5D",
        mediaType: "none",
        eventName: "ctasection_ext_email_primary",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
  </div>
</div>
