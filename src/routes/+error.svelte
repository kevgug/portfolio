<script>
  import { page } from "$app/stores";
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<div
  class="flex flex-col w-full
        supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh] h-screen
        py-12 md:py-0
        items-center justify-center"
>
  <h1
    class="text-glacial-blue
			    mt-auto md:mt-0"
  >
    {$page.status}
  </h1>
  <h2 class="text-glacial-blue mt-1">{$page.error?.message}</h2>
  <div class="mt-auto md:mt-20">
    <PrimaryButton
      linkButtonContent={{
        label: "Return home",
        destination: "/",
        eventName: "errorpage_navigateto_homepage",
      }}
      iconName="house-entrance"
    />
  </div>
</div>

<style lang="postcss">
  :root {
    background-color: theme(colors.background);
  }

  h1 {
    @apply font-semibold;
    @apply text-4xl md:text-5xl;
    @apply leading-tight;
  }

  h2 {
    @apply text-lg md:text-xl;
  }
</style>
