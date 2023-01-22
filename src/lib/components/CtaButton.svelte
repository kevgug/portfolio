<script lang="ts">
  export let label = "";
</script>

<button class="button-84 flex flex-row">
  {label}
  <div class="mr-[0.4rem] md:mr-[0.6rem]" />
  <svg
    class="w-[0.65rem] md:w-[0.8rem] h-[0.65rem] md:h-[0.8rem]"
    viewBox="0 0 14 15"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g
        id="Wide-V1"
        transform="translate(-661.000000, -847.000000)"
        stroke="#FFFFFF"
        stroke-width="1.5"
      >
        <g id="Group-7" transform="translate(521.000000, 843.000000)">
          <g id="arrow-down" transform="translate(141.000000, 5.000000)">
            <line x1="6" y1="0" x2="6" y2="13" id="Path" />
            <polyline id="Path" points="0 7 6 13 12 7" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</button>

<style lang="postcss">
  .button-84 {
    align-items: center;
    background-image: linear-gradient(180deg, #3a3c42 0%, #232529 99%);
    border: 1px solid #434343;
    @apply rounded-lg md:rounded-xl;
    color: theme(colors.white);
    @apply px-[0.85rem] md:px-4;
    @apply py-2;

    @apply transition-opacity;
    @apply duration-150;
  }

  .button-84:hover {
    box-shadow: rgba(0, 1, 0, 0.2) 0 2px 8px;
    opacity: 0.85;

    @apply transition-opacity;
    @apply duration-200;
  }

  .button-84:active {
    outline: 0;
  }

  .button-84:focus {
    box-shadow: rgba(0, 0, 0, 0.5) 0 0 0 3px;
  }

  @media (max-width: 420px) {
    .button-84 {
      height: 48px;
    }
  }
</style>
