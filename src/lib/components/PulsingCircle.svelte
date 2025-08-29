<script lang="ts">
  export let size: number = 8; // Size in pixels for the base circle
</script>

<div
  class="relative flex items-center justify-center"
  style="width: {size}px; height: {size}px;"
>
  <!-- Multiple ripple circles for continuous effect -->
  <div class="absolute inset-0 flex items-center justify-center">
    <div
      class="absolute rounded-full bg-glacial-blue animate-breathe opacity-20"
      style="width: {size}px; height: {size}px;"
    />
  </div>

  <div class="absolute inset-0 flex items-center justify-center">
    <div
      class="absolute rounded-full bg-glacial-blue animate-breathe opacity-20"
      style="width: {size}px; height: {size}px; animation-delay: 1.75s;"
    />
  </div>

  <!-- Main breathing circle -->
  <div
    class="relative rounded-full bg-glacial-blue animate-breathe-main"
    style="width: {size / 2}px; height: {size / 2}px;"
  />
</div>

<style>
  @keyframes breathe {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    10% {
      transform: scale(0.6);
      opacity: 0.3;
    }
    70% {
      transform: scale(1.4);
      opacity: 0.15;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  @keyframes breathe-main {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  .animate-breathe {
    /* Custom ease-out: starts fast, then slows down naturally */
    animation: breathe 3.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
  }

  .animate-breathe-main {
    /* Custom ease-in-out: smoother, more dynamic breathing */
    animation: breathe-main 3.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
</style>
