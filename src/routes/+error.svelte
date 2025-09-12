<script lang="ts">
  import { page } from "$app/stores";
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import type { IconName } from "$lib/components/Icon.svelte";

  const essayButtonContent: LinkButtonContent = {
    label: "Browse essays",
    destination: "/essays",
    mediaType: "webpage",
    eventName: "errorpage_navigateto_essays",
  };

  const homeButtonContent: LinkButtonContent = {
    label: "Return home",
    destination: "/",
    mediaType: "webpage",
    eventName: "errorpage_navigateto_homepage",
  };

  const essayIconName: IconName = "book-open";
  const homeIconName: IconName = "house-entrance";

  $: isEssayRoute = $page.url.pathname.startsWith("/essays/");
  $: buttonContent = isEssayRoute ? essayButtonContent : homeButtonContent;
  $: iconName = isEssayRoute ? essayIconName : homeIconName;
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
    <PrimaryButton linkButtonContent={buttonContent} {iconName} />
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
