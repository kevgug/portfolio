<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let open: boolean = false; // true => up, false => down
  export let size: string = "18px";
  export let strokeWidth: number = 1.5;

  const t = tweened(0, { duration: 180, easing: cubicOut });
  $: t.set(open ? 1 : 0);

  const downLeft = { x1: 7, y1: 10, x2: 12, y2: 15 };
  const downRight = { x1: 17, y1: 10, x2: 12, y2: 15 };
  const upLeft = { x1: 7, y1: 14, x2: 12, y2: 9 };
  const upRight = { x1: 17, y1: 14, x2: 12, y2: 9 };

  function lerp(a: number, b: number, p: number): number {
    return a + (b - a) * p;
  }

  $: left = {
    x1: lerp(downLeft.x1, upLeft.x1, $t),
    y1: lerp(downLeft.y1, upLeft.y1, $t),
    x2: lerp(downLeft.x2, upLeft.x2, $t),
    y2: lerp(downLeft.y2, upLeft.y2, $t),
  };
  $: right = {
    x1: lerp(downRight.x1, upRight.x1, $t),
    y1: lerp(downRight.y1, upRight.y1, $t),
    x2: lerp(downRight.x2, upRight.x2, $t),
    y2: lerp(downRight.y2, upRight.y2, $t),
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="chevron-svg"
  aria-hidden="true"
>
  <line
    x1={left.x1}
    y1={left.y1}
    x2={left.x2}
    y2={left.y2}
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    vector-effect="non-scaling-stroke"
  />
  <line
    x1={right.x1}
    y1={right.y1}
    x2={right.x2}
    y2={right.y2}
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    vector-effect="non-scaling-stroke"
  />
</svg>

<style>
  .chevron-svg {
    overflow: visible;
    pointer-events: none;
  }
</style>
