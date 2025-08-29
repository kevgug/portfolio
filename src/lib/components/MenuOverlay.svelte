<script lang="ts">
  import { projects } from "$lib/projects";
  import scrollToElement from "scroll-to-element";
  import { fly, fade } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";

  export let open = false;

  // Prevent background scrolling when menu is open
  $: if (typeof document !== "undefined") {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  function handleProjectClick(id: string) {
    // Calculate navbar height offset (64px mobile, 80px desktop)
    const navbarOffset = window.innerWidth >= 768 ? 80 : 64;
    // Extra spacing for better visual positioning (36px mobile, 48px desktop)
    const additionalOffset = window.innerWidth >= 768 ? 48 : 36;
    const totalOffset = -(navbarOffset + additionalOffset); // Negative to scroll above the element

    scrollToElement(`#${id}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });
    open = false;
  }

  // Handle escape key to close menu
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      open = false;
    }
  }
</script>

<!-- Global escape key listener -->
<svelte:window on:keydown={handleKeyDown} />

{#if open}
  <div
    class="fixed inset-0 bg-background/80 backdrop-blur-xl z-40"
    on:click={() => (open = false)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") open = false;
    }}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 300 }}
  />

  <div
    class="fixed left-0 right-0 top-16 md:top-20 bottom-0 z-40 overflow-y-auto px-5 md:px-[2.5rem] xl:px-[5rem] py-12"
  >
    <ul class="flex flex-col items-center space-y-6 list-none">
      {#each projects as project, i}
        <li
          in:fly={{
            y: 20,
            duration: 400,
            delay: 200 + i * 50,
            easing: quintOut,
          }}
          out:fly={{ y: -10, duration: 200, easing: quintIn }}
        >
          <button
            on:click={() => handleProjectClick(project.id)}
            class="text-xl md:text-2xl xl:text-3xl font-medium text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white px-6 py-2"
          >
            {project.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  /* Override global list styling for menu items */
  ul {
    list-style: none !important;
    padding-left: 0 !important;
    margin: 0 !important;
  }

  li {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
    position: static !important; /* Override global relative positioning */
  }

  /* Remove global bullet point pseudo-elements */
  li::before {
    display: none !important;
    content: none !important;
  }

  /* Ensure no margin bottom from global styles */
  li:not(:last-child) {
    margin-bottom: 0 !important;
  }
</style>
