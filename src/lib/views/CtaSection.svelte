<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h2 class="text-glacial-blue uppercase">Hire me for an internship</h2>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      Open to work as a UI/UX Designer, Front-End Developer, or Digital
      Marketer.
    </li>
    <li>Bilingual in English and German.</li>
    <li>Authorized to work in the UK, EU, and Switzerland.</li>
  </ul>
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Email",
        destination: "mailto:contact@kevingugelmann.com",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
    <PrimaryButton
      linkButtonContent={{
        label: "LinkedIn",
        destination: "https://www.linkedin.com/in/kevingugelmann/",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
  </div>
</div>
