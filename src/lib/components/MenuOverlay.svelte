<script lang="ts">
  import { projects } from "$lib/projects";
  import scrollToElement from "scroll-to-element";
  import { fly, fade } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";
  import { onMount } from "svelte";
  import FloatingProjectImage from "$lib/components/FloatingProjectImage.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import type { Project } from "$lib/projects";

  export let open = false;

  // Floating image state
  let mouseX = 0;
  let mouseY = 0;
  let hoveredProject: Project | null = null;
  let isDesktop = true;

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

    // Force projects section to be visible immediately if it's hidden
    const projectsSection = document.querySelector(
      ".projects-section-on-load"
    ) as HTMLElement;
    if (projectsSection) {
      const isHidden = window.getComputedStyle(projectsSection).opacity === "0";
      if (isHidden) {
        // Force the section to be visible immediately
        projectsSection.style.opacity = "1";
        projectsSection.style.filter = "blur(0px)";
        projectsSection.style.transform = "translateY(0px)";
      }
    }

    // Scroll immediately
    scrollToElement(`#${id}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });

    open = false;
    hoveredProject = null;
  }

  // Handle escape key to close menu
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      open = false;
      hoveredProject = null;
    }
  }

  // Mouse tracking for floating image
  function handleMouseMove(event: MouseEvent) {
    if (isDesktop) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  }

  // Project hover handlers
  function handleProjectHover(project: Project) {
    if (isDesktop) {
      hoveredProject = project;
    }
  }

  function handleProjectLeave() {
    hoveredProject = null;
  }

  function handleContactClick() {
    const navbarOffset = window.innerWidth >= 768 ? 80 : 64;
    const additionalOffset = window.innerWidth >= 768 ? 48 : 36;
    const totalOffset = -(navbarOffset + additionalOffset);

    scrollToElement(`#contact`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });

    open = false;
    hoveredProject = null;
  }

  // Check if device is desktop - now enabled for all viewport sizes
  function checkIsDesktop() {
    if (typeof window !== "undefined") {
      isDesktop = true; // Enable hover effects on all viewport sizes
    }
  }

  onMount(() => {
    checkIsDesktop();
  });
</script>

<!-- Global event listeners -->
<svelte:window
  on:keydown={handleKeyDown}
  on:mousemove={handleMouseMove}
  on:resize={checkIsDesktop}
  on:load={checkIsDesktop}
/>

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
            on:mouseenter={() => handleProjectHover(project)}
            on:mouseleave={handleProjectLeave}
            class="text-xl md:text-2xl xl:text-3xl font-medium text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2"
          >
            {project.name}
          </button>
        </li>
      {/each}
      <li
        in:fly={{
          y: 20,
          duration: 400,
          delay: 200 + projects.length * 50 - 25,
          easing: quintOut,
        }}
        out:fly={{ y: -10, duration: 200, easing: quintIn }}
      >
        <div
          class="w-24 md:w-36 xl:w-48 h-px rounded-sm mx-auto my-5 md:my-7 bg-separator-grey opacity-55"
        />
      </li>
      <li
        in:fly={{
          y: 20,
          duration: 400,
          delay: 200 + projects.length * 50,
          easing: quintOut,
        }}
        out:fly={{ y: -10, duration: 200, easing: quintIn }}
      >
        <button
          on:click={handleContactClick}
          on:mouseenter={handleProjectLeave}
          on:mouseleave={handleProjectLeave}
          class="text-base md:text-lg xl:text-xl font-light text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2 mt-2 md:mt-3 flex items-center space-x-2 group"
        >
          <Icon
            name="person"
            size="1em"
            class="group-hover:text-glacial-blue"
          />
          <span class="group-hover:text-glacial-blue not-italic"
            >Contact info</span
          >
        </button>
      </li>
    </ul>
  </div>
{/if}

<!-- Floating project image -->
<FloatingProjectImage
  imageOptions={hoveredProject?.imgOptions || null}
  projectId={hoveredProject?.id || null}
  isVisible={!!hoveredProject && isDesktop && open}
  {mouseX}
  {mouseY}
/>

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
