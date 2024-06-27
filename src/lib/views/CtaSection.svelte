<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h1 class="text-glacial-blue">Let's Build Something Worth Sharing</h1>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      I'm actively working as Lead Developer Advocate at <a
        href="https://freestyle.sh">Freestyle</a
      > (YC S24).
    </li>
    <li>
      To unwind I keep active - along the way I've won <a
        href="https://hyrox.com/">Hyrox</a
      > Chicago U24 Men's (2023) and three national gold medals in UK school rowing.
    </li>
    <li>
      Free to just <a
        href="mailto:contact@kevingugelmann.com?body=Hi%20Kevin!%0A%0AI'm%20reaching%20out%20because%20"
        >say hi</a
      >! I always love to hear about new ideas, technologies, and training.
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
