<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { gsap } from "gsap";

  const VIDEO_FADE_SECONDS = 2;
  const ROUTE_DELAY_AFTER_TEXT_SECONDS = 1.2;
  const ROUTE_TRANSITION_ADVANCE_SECONDS = 1;
  const OUTRO_SHIFT_EARLIER_SECONDS = 4;
  const TOTAL_OUTRO_SECONDS =
    VIDEO_FADE_SECONDS + ROUTE_DELAY_AFTER_TEXT_SECONDS;

  let sequenceEl: HTMLDivElement;
  let messageEl: HTMLDivElement;
  let videoEl: HTMLVideoElement;

  let isLoaded = false;
  let isPlaying = false;
  let hasStartedPlayback = false;
  let showBlackStage = true;
  let revealMessage = false;
  let outroStarted = false;
  let outroStartSeconds = 8;
  let hasNavigatedHome = false;

  let bootTimeout: ReturnType<typeof setTimeout> | undefined;
  let removeGestureListeners: (() => void) | undefined;

  function clearTimers() {
    if (bootTimeout) clearTimeout(bootTimeout);
  }

  function routeHome() {
    if (hasNavigatedHome) return;
    hasNavigatedHome = true;
    if (videoEl) {
      videoEl.pause();
      videoEl.muted = true;
    }
    void goto("/", { replaceState: true });
  }

  async function beginPlayback() {
    if (!videoEl || isPlaying || hasNavigatedHome) return;
    isPlaying = true;
    videoEl.currentTime = 0;
    videoEl.muted = false;

    try {
      await videoEl.play();
      hasStartedPlayback = true;
      showBlackStage = false;
      removeGestureListeners?.();
      removeGestureListeners = undefined;
    } catch {
      // Autoplay with audio may be blocked until the next user gesture.
      isPlaying = false;
    }
  }

  function handleLoadedData() {
    if (isLoaded) return;
    isLoaded = true;
    if (bootTimeout) {
      clearTimeout(bootTimeout);
      bootTimeout = undefined;
    }
    void beginPlayback();
  }

  function handleLoadedMetadata() {
    if (!videoEl) return;
    if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;
    const computedStart =
      videoEl.duration -
      TOTAL_OUTRO_SECONDS -
      ROUTE_DELAY_AFTER_TEXT_SECONDS -
      OUTRO_SHIFT_EARLIER_SECONDS;
    // Ensure the outro still has enough runway on short media.
    outroStartSeconds = Math.max(0.05, computedStart);
  }

  function primeVideoReadiness() {
    if (!videoEl) return;
    if (videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleLoadedData();
    }
    if (videoEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
      handleLoadedMetadata();
    }
  }

  function handleVideoPlaying() {
    hasStartedPlayback = true;
    showBlackStage = false;
  }

  async function triggerOutro() {
    if (outroStarted || !videoEl) return;
    outroStarted = true;
    revealMessage = true;
    await tick();
    if (!messageEl) return;

    gsap.set(messageEl, { opacity: 0 });
    const outroTimeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: routeHome,
    });
    outroTimeline
      .to(
        videoEl,
        {
          opacity: 0,
          duration: VIDEO_FADE_SECONDS,
          ease: "power2.out",
        },
        0
      )
      .to(
        messageEl,
        {
          opacity: 1,
          duration: VIDEO_FADE_SECONDS,
          ease: "power2.out",
        },
        0
      )
      .to(
        {},
        {
          duration: Math.max(
            0,
            ROUTE_DELAY_AFTER_TEXT_SECONDS - ROUTE_TRANSITION_ADVANCE_SECONDS
          ),
        }
      );
  }

  function handleTimeUpdate() {
    if (!videoEl || outroStarted) return;
    const t = videoEl.currentTime;
    if (t >= outroStartSeconds) void triggerOutro();
  }

  function handleVideoEnded() {
    routeHome();
  }

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    bootTimeout = setTimeout(() => {
      if (!isLoaded) void goto("/", { replaceState: true });
    }, 8000);
    // Handles both cached and freshly loading media reliably.
    primeVideoReadiness();

    const handleGestureStart = () => {
      if (!hasStartedPlayback) void beginPlayback();
    };

    window.addEventListener("pointerdown", handleGestureStart, {
      passive: true,
    });
    window.addEventListener("keydown", handleGestureStart);
    removeGestureListeners = () => {
      window.removeEventListener("pointerdown", handleGestureStart);
      window.removeEventListener("keydown", handleGestureStart);
    };

    return () => {
      clearTimers();
      removeGestureListeners?.();
      removeGestureListeners = undefined;
      document.body.style.overflow = previousOverflow;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    };
  });
</script>

<svelte:head>
  <title>Roll | Kevin Gugelmann</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="roll-shell">
  <div class="sequence-layer" bind:this={sequenceEl}>
    <div class="black-stage" class:ready={!showBlackStage} />

    <div class="video-shell">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        bind:this={videoEl}
        class="roll-video"
        src="/ingstones.mp4"
        preload="auto"
        playsinline
        disablepictureinpicture
        controls={false}
        on:loadeddata={handleLoadedData}
        on:loadedmetadata={handleLoadedMetadata}
        on:playing={handleVideoPlaying}
        on:timeupdate={handleTimeUpdate}
        on:ended={handleVideoEnded}
      />
      <div class="vignette" />
    </div>

    {#if revealMessage}
      <div class="message-shell" bind:this={messageEl}>
        <h1>You got rickrolled by Kevin.</h1>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .roll-shell {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: #000;
    overflow: hidden;
  }

  .sequence-layer {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 1;
    transform: translateY(0);
  }

  .black-stage {
    position: absolute;
    inset: 0;
    background: #000;
    opacity: 1;
    pointer-events: none;
    transition: opacity 150ms linear;
    z-index: 3;
  }

  .black-stage.ready {
    opacity: 0;
  }

  .video-shell {
    position: absolute;
    inset: 0;
    background: #000;
    z-index: 1;
  }

  .roll-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
    opacity: 1;
    will-change: opacity;
  }

  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0) 58%,
      rgba(0, 0, 0, 0.44) 100%
    );
    transition: opacity 200ms ease;
  }

  .message-shell {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(92vw, 58rem);
    text-align: center;
    z-index: 5;
    pointer-events: none;
    padding: 0 clamp(1rem, 2vw, 2rem);
    opacity: 0;
  }

  .message-shell h1 {
    margin: 0;
    color: rgba(245, 253, 255, 0.98);
    font-family: "SangBleu Sunrise", serif;
    font-weight: 500;
    font-size: clamp(1.65rem, 3.2vw, 3.35rem);
    line-height: 1.05;
    text-wrap: balance;
  }

  @media (max-width: 720px) {
    .message-shell {
      width: min(95vw, 36rem);
    }
  }
</style>
