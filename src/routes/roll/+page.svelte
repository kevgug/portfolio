<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { gsap } from "gsap";

  const VIDEO_SRC = "/ingstones.mp4?v=2026-05-15-1";
  const VIDEO_FADE_SECONDS = 2;
  const ROUTE_DELAY_AFTER_TEXT_SECONDS = 1.2;
  const ROUTE_TRANSITION_ADVANCE_SECONDS = 1;
  const OUTRO_SHIFT_EARLIER_SECONDS = 4;
  const TOTAL_OUTRO_SECONDS =
    VIDEO_FADE_SECONDS + ROUTE_DELAY_AFTER_TEXT_SECONDS;

  let messageEl: HTMLDivElement;
  let videoEl: HTMLVideoElement;

  let isLoaded = false;
  let isPlaying = false;
  let playAttemptInFlight = false;
  let autoplayBlocked = false;
  let isMuted = false;
  let hasStartedPlayback = false;
  let hasMetadata = false;
  let showBlackStage = true;
  let revealMessage = false;
  let outroStarted = false;
  let outroStartSeconds = 8;
  let hasNavigatedHome = false;

  let removeGestureListeners: (() => void) | undefined;
  let lastTimeUpdateLogSecond = -1;

  function clearTimers() {
    // Reserved for future timers; keep cleanup centralized.
  }

  function logRoll(label: string, extra: Record<string, unknown> = {}) {
    const nowMs =
      typeof performance !== "undefined" ? Math.round(performance.now()) : 0;
    const media = videoEl
      ? {
          currentTime: Number(videoEl.currentTime.toFixed(3)),
          duration: Number.isFinite(videoEl.duration)
            ? Number(videoEl.duration.toFixed(3))
            : String(videoEl.duration),
          readyState: videoEl.readyState,
          networkState: videoEl.networkState,
          paused: videoEl.paused,
          ended: videoEl.ended,
          muted: videoEl.muted,
          error: videoEl.error
            ? {
                code: videoEl.error.code,
                message: videoEl.error.message,
              }
            : null,
        }
      : {};

    console.log(`[roll ${new Date().toISOString()} +${nowMs}ms] ${label}`, {
      isLoaded,
      isPlaying,
      playAttemptInFlight,
      autoplayBlocked,
      isMuted,
      hasStartedPlayback,
      hasMetadata,
      showBlackStage,
      outroStarted,
      outroStartSeconds,
      ...media,
      ...extra,
    });
  }

  function routeHome() {
    if (hasNavigatedHome) return;
    logRoll("routeHome:start");
    hasNavigatedHome = true;
    if (videoEl) {
      videoEl.pause();
      videoEl.muted = true;
      isMuted = true;
    }
    void goto("/", { replaceState: true });
  }

  function tryStartPlayback() {
    if (
      !videoEl ||
      hasNavigatedHome ||
      hasStartedPlayback ||
      isPlaying ||
      playAttemptInFlight ||
      autoplayBlocked
    ) {
      logRoll("tryStartPlayback:skipped", {
        reason: !videoEl
          ? "no-video"
          : hasNavigatedHome
            ? "already-navigating"
            : hasStartedPlayback
              ? "already-started"
              : isPlaying || playAttemptInFlight
                ? "already-trying"
                : "autoplay-blocked",
      });
      return;
    }
    if (!hasMetadata || videoEl.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      logRoll("tryStartPlayback:not-ready");
      return;
    }
    logRoll("tryStartPlayback:begin");
    void beginPlayback();
  }

  async function beginPlayback() {
    if (!videoEl || isPlaying || playAttemptInFlight || hasNavigatedHome) {
      logRoll("beginPlayback:skipped");
      return;
    }
    playAttemptInFlight = true;
    videoEl.currentTime = 0;
    videoEl.muted = false;
    isMuted = false;
    logRoll("beginPlayback:play-call");

    try {
      await videoEl.play();
      isPlaying = true;
      removeGestureListeners?.();
      removeGestureListeners = undefined;
      logRoll("beginPlayback:play-resolved");
    } catch (error) {
      // Autoplay with audio may be blocked until the next user gesture.
      isPlaying = false;
      autoplayBlocked = true;
      showBlackStage = false;
      logRoll("beginPlayback:play-rejected", {
        errorName: error instanceof DOMException ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      try {
        videoEl.muted = true;
        isMuted = true;
        logRoll("beginPlayback:muted-fallback-call");
        await videoEl.play();
        isPlaying = true;
        showBlackStage = false;
        logRoll("beginPlayback:muted-fallback-resolved");
      } catch (fallbackError) {
        logRoll("beginPlayback:muted-fallback-rejected", {
          errorName:
            fallbackError instanceof DOMException
              ? fallbackError.name
              : "unknown",
          errorMessage:
            fallbackError instanceof Error
              ? fallbackError.message
              : String(fallbackError),
        });
      }
    } finally {
      playAttemptInFlight = false;
    }
  }

  function handleCanStart() {
    logRoll("media:can-start");
    isLoaded = true;
    tryStartPlayback();
  }

  function handleLoadedMetadata() {
    if (!videoEl) return;
    logRoll("media:loadedmetadata");
    if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;
    hasMetadata = true;
    const computedStart =
      videoEl.duration -
      TOTAL_OUTRO_SECONDS -
      ROUTE_DELAY_AFTER_TEXT_SECONDS -
      OUTRO_SHIFT_EARLIER_SECONDS;
    // Ensure the outro still has enough runway on short media.
    outroStartSeconds = Math.max(0.05, computedStart);
    logRoll("media:metadata-computed", { computedStart });
    tryStartPlayback();
  }

  function primeVideoReadiness() {
    if (!videoEl) return;
    logRoll("primeVideoReadiness");
    if (videoEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
      handleLoadedMetadata();
    }
    if (videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleCanStart();
    }
  }

  function handleVideoPlaying() {
    showBlackStage = false;
    logRoll("media:playing");
  }

  function handleVolumeChange() {
    if (!videoEl) return;
    isMuted = videoEl.muted || videoEl.volume === 0;
    logRoll("media:volumechange");
  }

  async function triggerOutro() {
    if (outroStarted || !videoEl) return;
    outroStarted = true;
    revealMessage = true;
    logRoll("outro:start");
    await tick();
    if (!messageEl) {
      logRoll("outro:missing-message");
      return;
    }

    gsap.set(messageEl, { opacity: 0 });
    const outroTimeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        logRoll("outro:complete");
        routeHome();
      },
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
    if (!hasStartedPlayback && t > 0.05) {
      hasStartedPlayback = true;
      isPlaying = true;
      showBlackStage = false;
      if (!autoplayBlocked) {
        removeGestureListeners?.();
        removeGestureListeners = undefined;
      }
      logRoll("media:confirmed-time-advanced");
    }
    const wholeSecond = Math.floor(t);
    if (wholeSecond !== lastTimeUpdateLogSecond) {
      lastTimeUpdateLogSecond = wholeSecond;
      logRoll("media:timeupdate");
    }
    if (!hasStartedPlayback) return;
    if (t >= outroStartSeconds) void triggerOutro();
  }

  function handleVideoEnded() {
    logRoll("media:ended");
    routeHome();
  }

  onMount(() => {
    logRoll("mount:start", { src: VIDEO_SRC });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    logRoll("mount:prime-readiness");
    requestAnimationFrame(() => primeVideoReadiness());

    const handleGestureStart = () => {
      logRoll("gesture:start");
      if (autoplayBlocked && videoEl) {
        videoEl.muted = false;
        isMuted = false;
        autoplayBlocked = false;
        logRoll("gesture:unmuted");
        removeGestureListeners?.();
        removeGestureListeners = undefined;
      }
      if (!hasStartedPlayback) {
        autoplayBlocked = false;
        tryStartPlayback();
      }
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
      logRoll("destroy");
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
  <div class="sequence-layer">
    <div class="black-stage" class:ready={!showBlackStage} />

    <div class="video-shell">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        bind:this={videoEl}
        class="roll-video"
        src={VIDEO_SRC}
        preload="auto"
        playsinline
        disablepictureinpicture
        controls={false}
        on:abort={() => logRoll("media:abort")}
        on:emptied={() => logRoll("media:emptied")}
        on:loadstart={() => logRoll("media:loadstart")}
        on:durationchange={() => logRoll("media:durationchange")}
        on:loadeddata={handleCanStart}
        on:canplay={handleCanStart}
        on:canplaythrough={() => logRoll("media:canplaythrough")}
        on:progress={() => logRoll("media:progress")}
        on:suspend={() => logRoll("media:suspend")}
        on:waiting={() => logRoll("media:waiting")}
        on:loadedmetadata={handleLoadedMetadata}
        on:playing={handleVideoPlaying}
        on:play={() => logRoll("media:play-event")}
        on:pause={() => logRoll("media:pause-event")}
        on:volumechange={handleVolumeChange}
        on:timeupdate={handleTimeUpdate}
        on:ended={handleVideoEnded}
        on:stalled={() => logRoll("media:stalled")}
        on:error={() => logRoll("media:error")}
      />
      <div class="vignette" />
    </div>

    {#if isMuted && !hasNavigatedHome}
      <div class="mute-indicator" aria-label="Video muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="Volume-Control-Off--Streamline-Ultimate"
          height="36"
          width="36"
          aria-hidden="true"
        >
          <desc>
            Volume Control Off Streamline Icon: https://streamlinehq.com
          </desc>
          <g>
            <path
              d="m11 16.88 3.06 1.95a1.5 1.5 0 0 0 2.4 -1.2V13"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
            <path
              d="M9.3 14.63H4.5a1.5 1.5 0 0 1 -1.5 -1.5v-3a1.5 1.5 0 0 1 1.5 -1.5h3l6.6 -4.21a1.5 1.5 0 0 1 2.4 1.21v3"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
            <path
              d="m3 19.87 18 -15"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </g>
        </svg>
      </div>
    {/if}

    {#if revealMessage}
      <div class="message-shell" bind:this={messageEl}>
        <h1>You got rickrolled by Kevin G.</h1>
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

  .mute-indicator {
    position: absolute;
    right: clamp(1rem, 3vw, 2rem);
    bottom: clamp(1rem, 3vw, 2rem);
    z-index: 6;
    display: grid;
    place-items: center;
    width: 3.25rem;
    height: 3.25rem;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 9999px;
    color: rgba(255, 255, 255, 0.92);
    background: rgba(0, 0, 0, 0.42);
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .mute-indicator svg {
    width: 36px;
    height: 36px;
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
