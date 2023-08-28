<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h2 class="text-glacial-blue uppercase">Excited to join your team</h2>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      Open to work as a SaaS Designer, Developer, and/or Marketing Strategist.
    </li>
    <li>Authorized to work in the UK, USA, EU, and Switzerland.</li>
    <li>Native in English and German.</li>
  </ul>
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Email",
        destination: "mailto:contact@kevingugelmann.com",
        eventName: "ctasection_ext_email_primary",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
    <PrimaryButton
      linkButtonContent={{
        label: "LinkedIn",
        destination: "https://www.linkedin.com/in/kevingugelmann/",
        eventName: "ctasection_ext_linkedin",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
  </div>
</div>
