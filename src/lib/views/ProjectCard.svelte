<script lang="ts">
  import tinycolor from "tinycolor2";
  import { scaleLinear } from "d3-scale";

  import Image from "$lib/components/Image.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import { tailwindTheme } from "$lib/tailwindTheme";
  import { getCurrentBreakpoint, BreakpointSizes } from "$lib/util/breakpoints";

  export let year: number;
  export let name: string;
  export let outputMedium: string;
  export let role: string;
  export let imgOptions: ImageOptions;
  export let description: string;
  export let builtWith: string[] | undefined;
  export let linkButtonContent: LinkButtonContent | undefined;
  export let bgColor: string | undefined; // hex

  // --- STYLING ---
  if (!bgColor) {
    bgColor = "#0d2860";
  }
  // Border color is 10% lighter than bg color
  const borderColor = tinycolor(bgColor).lighten(5).toHexString();
  const interactiveIconColor = tailwindTheme.colors["glacial-blue"];

  // --- 3D HOVER EFFECT ---
  let rotateX = 0;
  let rotateY = 0;
  let shadowOffsetX = 0;
  let shadowOffsetY = 0;
  let brightness = 1;
  let scale = 1;

  let isHoveringLinkBtn = false;

  // Responsive maxRotation based on breakpoint
  let screenWidth = 0;
  let maxRotation = 5;
  let width = 0;
  let height = 0;

  // Function to get maxRotation based on current breakpoint
  const getMaxRotation = (screenWidth: number): number => {
    const breakpoint = getCurrentBreakpoint(screenWidth);
    switch (breakpoint) {
      case BreakpointSizes.xl:
      case BreakpointSizes["2xl"]:
        return 1.5; // 1.5% for xl and above
      case BreakpointSizes.lg:
        return 2; // 2.5% for lg
      case BreakpointSizes.md:
        return 5.5; // 5.5% for md
      default:
        return 2.5; // 2.5% for sm and below (default/mobile)
    }
  };

  // Reactive statement to update maxRotation when screen width changes
  $: maxRotation = getMaxRotation(screenWidth);

  let maxRotateDuration = 900;
  let minRotateDuration = 100;
  let rotateDuration = maxRotateDuration;
  let rotateDurationChangeTimer: NodeJS.Timeout;

  let maxBrightnessDuration = 300;
  let minBrightnessDuration = 100;
  let brightnessDuration = maxBrightnessDuration;
  let brightnessDurationChangeTimer: NodeJS.Timeout;

  $: img3dStyle = `
  --rotateX: ${rotateX}deg;
  --rotateY: ${rotateY}deg;
  --shadowOffsetX: ${shadowOffsetX}px;
  --shadowOffsetY: ${shadowOffsetY}px;
  --brightness: ${brightness};
  --scale: ${scale};
  --rotateDuration: ${rotateDuration}ms;
  --brightnessDuration: ${brightnessDuration}ms;
  `;
  $: scaleX = scaleLinear()
    .domain([0, height])
    .range([-maxRotation, maxRotation]);
  $: scaleY = scaleLinear()
    .domain([0, width])
    .range([maxRotation, -maxRotation]);
  $: scaleBrightness = scaleLinear().domain([0, height]).range([0.55, 0.4]);

  const onMouseEnterCard = !linkButtonContent
    ? () => {}
    : () => {
        isHoveringLinkBtn = true;

        // Start timer for quickly reducing rotateDuration to min value
        rotateDurationChangeTimer = setInterval(() => {
          rotateDuration -= (maxRotateDuration - minRotateDuration) / 20;
          if (rotateDuration <= minRotateDuration) {
            clearInterval(rotateDurationChangeTimer);
          }
        }, 10);

        // Start timer for quickly reducing brightnessDuration to min value
        brightnessDurationChangeTimer = setInterval(() => {
          brightnessDuration -=
            (maxBrightnessDuration - minBrightnessDuration) / 20;
          if (brightnessDuration <= minBrightnessDuration) {
            clearInterval(brightnessDurationChangeTimer);
          }
        }, 10);
      };
  const onMouseMoveCard = !linkButtonContent
    ? () => {}
    : (ev: MouseEvent) => {
        const mouseX = ev.offsetX;
        const mouseY = ev.offsetY;

        rotateY = scaleY(mouseX);
        rotateX = scaleX(mouseY);
        shadowOffsetX = -rotateY * 0.5;
        shadowOffsetY = rotateX * 0.5;
        brightness = scaleBrightness(mouseY);
        scale = (width + 12) / width;
      };
  const onMouseLeaveCard = !linkButtonContent
    ? () => {}
    : () => {
        rotateX = 0;
        rotateY = 0;
        shadowOffsetX = 0;
        shadowOffsetY = 0;
        brightness = 1;
        scale = 1;

        if (rotateDurationChangeTimer) {
          clearInterval(rotateDurationChangeTimer);
        }
        if (brightnessDurationChangeTimer) {
          clearInterval(brightnessDurationChangeTimer);
        }
        rotateDuration = maxRotateDuration;
        brightnessDuration = maxBrightnessDuration;

        isHoveringLinkBtn = false;
      };

  const onMouseEnterLinkBtn = () => {
    scale = (width + 6) / width;
    // brightness = 0.85;
    isHoveringLinkBtn = true;
  };
  const onMouseLeaveLinkBtn = () => {
    scale = 1;
    // brightness = 1;
    isHoveringLinkBtn = false;
  };
</script>

<div bind:clientWidth={screenWidth}>
  <div class="flex flex-col md:flex-row justify-between">
    <div class="flex flex-col md:flex-row">
      <p
        class="font-semibold text-muted-text-grey 
              leading-none
              md:mr-4 xl:mr-4.5"
      >
        {year}
      </p>
      <!-- MD+ : Align top of h2 with p's -->
      <h2
        class="text-xl md:text-2xl lg:text-3xl font-semibold
              leading-none
              mt-[0.52rem] md:mt-[-0.145rem] lg:mt-[-0.21rem]"
      >
        {name}
      </h2>
    </div>
    <!-- Never shrinks -->
    <p
      class="text-muted-text-grey
            leading-none
            shrink-0 ml-0 md:ml-10 lg:ml-12
            mt-[0.64rem] md:mt-0"
    >
      {outputMedium} — {role}
    </p>
  </div>

  <div
    style="background-color: {bgColor}; border-color: {borderColor};"
    class="flex flex-col md:flex-row
          mt-8 md:mt-9 lg:mt-10
          p-7
          border-solid border-[1px]
          rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl"
  >
    <div
      class="img3d group
            {linkButtonContent ? 'interactive' : ''}
            {isHoveringLinkBtn ? 'hover-link-btn' : ''}
            flex justify-center items-center
            mt-1 md:mt-0"
      style={img3dStyle}
      bind:clientWidth={width}
      bind:clientHeight={height}
      on:mouseenter={onMouseEnterCard}
      on:mousemove={onMouseMoveCard}
      on:mouseleave={onMouseLeaveCard}
    >
      <div class="rotate">
        <div class="img3d-content">
          <a
            href={typeof linkButtonContent?.destination == "string"
              ? linkButtonContent.destination
              : null}
            data-sa-link-event={linkButtonContent?.eventName ?? ""}
            target={linkButtonContent?.openInNewTab ?? false
              ? "_blank"
              : "_self"}
            rel={linkButtonContent?.openInNewTab ?? false ? "noreferrer" : ""}
            on:click={typeof linkButtonContent?.destination == "function"
              ? linkButtonContent.destination
              : null}
          >
            <div class="interactive-img">
              <Image
                {imgOptions}
                class="object-contain rounded-md lg:rounded-xl group-hover:rounded-xl lg:group-hover:rounded-2xl transition-all"
              />
            </div>
            <div
              class="absolute inset-0 flex justify-center items-center
                  pointer-events-none"
            >
              <svg
                class="interactive-icon h-1/3 w-1/3 max-h-[8em] max-w-[8em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={interactiveIconColor}
              >
                {#if linkButtonContent?.mediaType == "play"}
                  <path
                    d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm4.83 12.89 -7.38 3.69A1 1 0 0 1 8 15.69V8.31a1 1 0 0 1 1.45 -0.9l7.38 3.69a1 1 0 0 1 0 1.79Z"
                    stroke-width="1"
                  />
                {:else if linkButtonContent?.mediaType == "read"}
                  <g id="open-book--content-books-book-open"
                    ><path
                      id="Subtract"
                      fill-rule="evenodd"
                      d="M10.928571428571429 2.8337142857142856C9.233142857142857 1.884 6.061714285714285 0.72 2.5645714285714285 0.30685714285714283 1.1554285714285715 0.14057142857142857 0 1.3028571428571427 0 2.7222857142857144v13.714285714285714c0 1.421142857142857 1.1605714285714286 2.5525714285714285 2.5577142857142854 2.806285714285714 3.1542857142857144 0.5725714285714286 5.7788571428571425 2.0845714285714285 7.453714285714285 3.2811428571428567 0.28114285714285714 0.20057142857142857 0.5914285714285713 0.35142857142857137 0.9171428571428571 0.456V2.8337142857142856Zm2.142857142857143 20.146285714285714c0.3257142857142857 -0.10285714285714284 0.6342857142857142 -0.2554285714285714 0.9154285714285715 -0.4542857142857143 1.6748571428571428 -1.1965714285714284 4.299428571428571 -2.710285714285714 7.4554285714285715 -3.282857142857143 1.397142857142857 -0.25371428571428567 2.5577142857142854 -1.3851428571428572 2.5577142857142854 -2.806285714285714v-13.714285714285714C24 1.3028571428571427 22.844571428571427 0.14057142857142857 21.43542857142857 0.30857142857142855c-3.497142857142857 0.4148571428571428 -6.668571428571428 1.5771428571428572 -8.363999999999999 2.5268571428571427v20.146285714285714Z"
                      clip-rule="evenodd"
                      stroke-width="1"
                    /></g
                  >
                {:else if linkButtonContent?.mediaType == "webpage"}
                  <g
                    id="web--server-world-internet-earth-www-globe-worldwide-web-network"
                    ><g id="Subtract"
                      ><path
                        d="M8.25 12c0 0.95 0.0425 1.871 0.1215 2.75h7.257c0.079 -0.879 0.1215 -1.8 0.1215 -2.75s-0.0425 -1.871 -0.122 -2.75H8.372A30.595 30.595 0 0 0 8.25 12Z"
                        stroke-width="1"
                      /><path
                        d="M6.8665 9.25A32.134 32.134 0 0 0 6.75 12c0 0.943 0.04 1.8635 0.116 2.75H1.0885A11.274 11.274 0 0 1 0.75 12c0 -0.9485 0.1175 -1.87 0.3385 -2.75h5.778Z"
                        stroke-width="1"
                      /><path
                        d="M8.5495 7.75H15.45c-0.222 -1.5135 -0.558 -2.863 -0.9745 -3.9715 -0.3895 -1.0365 -0.8345 -1.824 -1.29 -2.338C12.729 0.9245 12.326 0.75 12 0.75c-0.3265 0 -0.729 0.175 -1.186 0.69 -0.4555 0.515 -0.9005 1.302 -1.29 2.3385 -0.4165 1.1085 -0.7525 2.458 -0.975 3.9715Z"
                        stroke-width="1"
                      /><path
                        d="M17.1335 9.25c0.0765 0.8865 0.1165 1.807 0.1165 2.75 0 0.943 -0.04 1.8635 -0.116 2.75h5.7775c0.221 -0.88 0.3385 -1.8015 0.3385 -2.75 0 -0.9485 -0.1175 -1.87 -0.3385 -2.75H17.1335Z"
                        stroke-width="1"
                      /><path
                        d="M22.42 7.75H16.9655c-0.235 -1.694 -0.607 -3.225 -1.086 -4.499 -0.305 -0.813 -0.661 -1.541 -1.0665 -2.1465 3.46 0.891 6.275 3.3865 7.606 6.6455Z"
                        stroke-width="1"
                      /><path
                        d="M7.034 7.75H1.5805C2.911 4.491 5.7265 1.9955 9.1865 1.105c-0.405 0.605 -0.7615 1.333 -1.067 2.146 -0.4785 1.274 -0.85 2.805 -1.085 4.499Z"
                        stroke-width="1"
                      /><path
                        d="M7.033 16.25H1.5805c1.33 3.2575 4.143 5.752 7.6 6.644 -0.405 -0.605 -0.76 -1.333 -1.065 -2.145 -0.4775 -1.275 -0.8485 -2.805 -1.0825 -4.499Z"
                        stroke-width="1"
                      /><path
                        d="M14.48 20.222c0.415 -1.1085 0.75 -2.458 0.972 -3.972H8.548c0.2215 1.514 0.5565 2.8635 0.9725 3.972 0.3885 1.0365 0.833 1.8235 1.289 2.3375 0.4565 0.515 0.8605 0.6905 1.1905 0.6905 0.33 0 0.734 -0.1755 1.19 -0.6905 0.4565 -0.514 0.901 -1.301 1.29 -2.3375Z"
                        stroke-width="1"
                      /><path
                        d="M15.884 20.7485c0.478 -1.274 0.849 -2.805 1.083 -4.4985h5.4525c-1.33 3.2575 -4.143 5.752 -7.6 6.644 0.405 -0.605 0.76 -1.333 1.065 -2.145Z"
                        stroke-width="1"
                      /></g
                    ></g
                  >
                {/if}
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col md:justify-between
            w-full md:min-w-[20em] md:max-w-[25em]
            mt-2 md:mt-0 md:pl-8
            mr-0.5 md:mr-1.5 xl:mr-2
            py-0.5 md:py-2"
    >
      {#if linkButtonContent}
        <!-- Always need top padding if there's a link -->
        <div class="h-5" />
      {:else}
        <!-- SM : Always need y padding between image and description -->
        <div class="h-5 md:h-0" />
      {/if}
      <div
        class="flex flex-col h-full justify-center
              my-0 md:my-10"
      >
        <p class="font-serif text-description-text-grey">{description}</p>
        {#if builtWith}
          <div class="flex flex-wrap mt-5 md:mt-6 lg:mt-7">
            {#each builtWith as tool, i}
              <div class="flex flex-row">
                <p class="font-serif text-muted-text-grey">{tool}</p>
                {#if i != builtWith.length - 1}
                  <p class="font-serif text-muted-text-grey px-2">|</p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
      {#if linkButtonContent}
        <div
          class="flex justify-end h-5
      mt-14 md:mt-0"
        >
          <div
            on:mouseenter={onMouseEnterLinkBtn}
            on:mouseleave={onMouseLeaveLinkBtn}
          >
            <LinkButton {linkButtonContent} />
          </div>
        </div>
      {:else}
        <!-- So that justify-between still centers description text (MD+) -->
        <div />
      {/if}
    </div>
  </div>
</div>

<style>
  .img3d {
    --rotateX: 0;
    --rotateY: 0;
    --scale: 1;
    --rotateDuration: 900ms;

    perspective: 600px;
  }

  .img3d,
  .img3d .img3d-content {
    transition: all 900ms cubic-bezier(0.16, 1, 0.17, 0.99);
    transform: scale(var(--scale));
  }

  .img3d .rotate {
    transform: rotateX(var(--rotateX)) rotateY(var(--rotateY));
    transition: all var(--rotateDuration) cubic-bezier(0.16, 1, 0.17, 0.99);
  }

  /* Brightness only changes on hover interactive project imgs */
  .img3d.interactive .img3d-content .interactive-img {
    filter: brightness(1);
    transition: all var(--brightnessDuration) cubic-bezier(0.16, 1, 0.17, 0.99);
  }
  .img3d.interactive:hover .interactive-img {
    /* If on touchscreen, `min` ensures img still fades to 0.55 brightness on hover */
    filter: brightness(calc(min(var(--brightness), 0.55)));
  }

  /* Icon only appears on hover interactive project imgs */
  .img3d svg {
    opacity: 0;
  }
  .img3d.interactive:hover svg {
    opacity: 1;
  }
  .interactive-icon {
    /* strong shadow */
    filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.2));
    transition: all 250ms ease-out;
  }
  .img3d:not(.interactive) a {
    cursor: default;
  }
</style>
