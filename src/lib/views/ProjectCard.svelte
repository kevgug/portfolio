<script lang="ts">
  import tinycolor from "tinycolor2";
  import { scaleLinear } from "d3-scale";

  import Image from "$lib/components/Image.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import { tailwindTheme } from "$lib/tailwindTheme";

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

  let maxRotation = 5;
  let width = 0;
  let height = 0;

  $: img3dStyle = `
  --rotateX: ${rotateX}deg;
  --rotateY: ${rotateY}deg;
  --shadowOffsetX: ${shadowOffsetX}px;
  --shadowOffsetY: ${shadowOffsetY}px;
  --brightness: ${brightness};
  --scale: ${scale};
  `;
  $: scaleX = scaleLinear()
    .domain([0, height])
    .range([-maxRotation, maxRotation]);
  $: scaleY = scaleLinear()
    .domain([0, width])
    .range([-maxRotation, maxRotation]);
  $: scaleBrightness = scaleLinear().domain([0, height]).range([0.55, 0.4]);

  const onMouseEnterCard = !linkButtonContent
    ? () => {}
    : () => {
        isHoveringLinkBtn = true;
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

        isHoveringLinkBtn = false;
      };

  const onMouseEnterLinkBtn = () => {
    scale = (width + 4) / width;
    // brightness = 0.85;
    isHoveringLinkBtn = true;
  };
  const onMouseLeaveLinkBtn = () => {
    scale = 1;
    // brightness = 1;
    isHoveringLinkBtn = false;
  };
</script>

<div>
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
      class="img3d
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
      <div class="img3d-content">
        <a
          href={typeof linkButtonContent?.destination == "string"
            ? linkButtonContent.destination
            : null}
          data-sa-link-event={linkButtonContent?.eventName ?? ""}
          target={linkButtonContent?.openInNewTab ?? false ? "_blank" : "_self"}
          rel={linkButtonContent?.openInNewTab ?? false ? "noreferrer" : ""}
          on:click={typeof linkButtonContent?.destination == "function"
            ? linkButtonContent.destination
            : null}
        >
          <div class="interactive-img">
            <Image
              {imgOptions}
              class="object-contain rounded-md lg:rounded-xl"
            />
          </div>
          <div class="absolute inset-0 flex justify-center items-center">
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
              {/if}
            </svg>
          </div>
        </a>
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
              my-0 md:my-10 lg:my-0"
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

    perspective: 600px;
  }
  .img3d.interactive.hover-link-btn .img3d-content {
    box-shadow: var(--shadowOffsetX) var(--shadowOffsetY) 5rem
      rgba(0, 0, 0, 0.3);
  }
  .img3d svg {
    opacity: 0;
  }
  .img3d.interactive:hover svg {
    opacity: 1;
  }
  .img3d,
  .img3d .img3d-content {
    transition: all 250ms ease-out;
    transform: rotateX(var(--rotateX)) rotateY(var(--rotateY))
      scale(var(--scale));
  }
  .img3d .img3d-content .interactive-img {
    filter: brightness(var(--brightness));
    transition: all 250ms ease-out;
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
