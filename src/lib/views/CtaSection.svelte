<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h1 class="text-glacial-blue">Let's Build Something Worth Sharing</h1>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      I'm a UX Designer at <a href="https://jpmorgan.com">JPMorgan</a>
      and former Full-Stack Engineer at
      <a href="https://www.freestyle.sh">Freestyle</a>
      (YC S24).
    </li>
    <li>
      To unwind I keep active—I've won <a href="https://hyrox.com/">Hyrox</a> U24
      in Chicago and three national gold medals in UK school rowing.
    </li>
    <li>
      Feel free to <a
        href="mailto:contact@kevingugelmann.com?body=Hi%20Kevin!%0A%0AI'm%20reaching%20out%20because%20"
        >reach out</a
      > anytime. If I don't respond within 48h, I may be hiking with my dad.
    </li>
  </ul>
  <div class="flex flex-row space-x-3.5">
    <PrimaryButton
      linkButtonContent={{
        label: "Email",
        destination: "mailto:contact@kevingugelmann.com",
        mediaType: "none",
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
        mediaType: "none",
        eventName: "ctasection_ext_linkedin",
        openInNewTab: true,
      }}
      iconName="arrow-corner-right"
      iconFlipY
    />
  </div>
</div>
