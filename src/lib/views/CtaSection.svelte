<script>
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div>
  <h2 class="text-glacial-blue uppercase">
    If you made it this far, thank you
  </h2>
  <ul class="my-9 md:my-11 lg:my-12">
    <li>
      While I'm actively working on a startup, I'm always open to future
      opportunities
    </li>
    <li>
      Whether you're a startup or established brand, let's discuss your project
    </li>
    <ul class="list-disc ml-6 mb-5">
      <li>UI/UX design</li>
      <li>Frontend development</li>
      <li>Backend development</li>
      <li>Marketing strategy</li>
      <li>Copywriting</li>
    </ul>
    <li>
      Or feel free to just say hi – I always love to hear about new ideas,
      tools, and technologies
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
