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
      Drove 2x traffic increase for $30MM+ fintech and AI startups by
      strategically optimizing sitemaps and copy.
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
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Schedule 15 min",
        destination: "https://cal.com/kevgug/15min",
        mediaType: "none",
        eventName: "ctasection_ext_cal_primary",
        openInNewTab: true,
      }}
      iconName="phone"
      iconFlipY={false}
    />
    <PrimaryButton
      linkButtonContent={{
        label: "Email",
        destination: "mailto:hello@kevingugelmann.com",
        mediaType: "none",
        eventName: "ctasection_ext_email_primary",
        openInNewTab: true,
      }}
      iconName="email"
    />
  </div>
</div>
