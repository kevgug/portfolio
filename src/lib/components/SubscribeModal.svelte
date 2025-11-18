<script lang="ts">
  import { subscribeModalOpen } from "$lib/stores/subscribe";
  import { get } from "svelte/store";
  import { scale, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let email = "";

  // Smooth cubic easing curve
  const cubicEasing = (t: number) => 1 - Math.pow(1 - t, 3);

  function close() {
    subscribeModalOpen.set(false);
  }

  function submitForm(e: Event) {
    e.preventDefault();
    // TODO: Implement real subscription
    subscribeModalOpen.set(false);
  }
</script>

{#if $subscribeModalOpen}
  <div class="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
    <div
      class="absolute inset-0 bg-background/80 backdrop-blur-md"
      on:click={close}
      on:keydown={(e) => e.key === "Escape" && close()}
      in:fade={{ duration: 300, easing: cubicOut }}
      out:fade={{ duration: 150, easing: cubicOut }}
      tabindex="-1"
    />
    <div class="absolute inset-0 flex items-center justify-center px-5">
      <div
        class="w-full max-w-md bg-background/90 border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl"
        in:scale={{ duration: 400, easing: cubicEasing, start: 0.95 }}
        out:scale={{ duration: 200, easing: cubicEasing, start: 0.95 }}
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-semibold text-white">
            Subscribe
          </h2>
          <button
            class="text-muted-text-grey hover:text-white transition-colors p-2 -m-2"
            on:click={close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p class="text-sm md:text-base text-muted-text-grey">
          Get new posts from <span class="text-white">Kevin Gugelmann</span> in your
          inbox.
        </p>
        <form class="mt-5" on:submit={submitForm}>
          <div class="space-y-3">
            <input
              type="email"
              placeholder="Your email"
              bind:value={email}
              required
              autofocus
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
