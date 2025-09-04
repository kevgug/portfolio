<script lang="ts">
  import { subscribeModalOpen } from "$lib/stores/subscribe";
  import { get } from "svelte/store";

  let email = "";

  function close() {
    subscribeModalOpen.set(false);
  }

  function submitForm(e: Event) {
    e.preventDefault();
    // Placeholder: Implement real subscription later
    // For now, simply close and show a console message
    console.log("Subscribe:", email);
    subscribeModalOpen.set(false);
  }
</script>

{#if $subscribeModalOpen}
  <div class="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
    <div
      class="absolute inset-0 bg-background/80 backdrop-blur-md"
      on:click={close}
    />
    <div class="absolute inset-0 flex items-center justify-center px-5">
      <div
        class="w-full max-w-md bg-background/90 border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-semibold text-white">Subscribe</h2>
          <button
            class="text-muted-text-grey hover:text-white transition-colors"
            on:click={close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p class="text-sm md:text-base text-muted-text-grey">
          Get new posts from <span class="text-white">Kevin Gugelmann</span> in
          your inbox.
        </p>
        <form class="mt-5" on:submit={submitForm}>
          <div class="space-y-3">
            <input
              type="email"
              placeholder="Your email"
              bind:value={email}
              required
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-glacial-blue/60"
            />
            <button
              type="submit"
              class="w-full bg-glacial-blue text-black rounded-xl px-4 py-3 font-medium hover:opacity-90 active:opacity-80 transition"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    overscroll-behavior: contain;
  }
</style>

