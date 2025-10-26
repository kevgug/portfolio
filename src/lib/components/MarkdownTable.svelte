<script lang="ts">
  import { marked } from "$lib/util/marked";

  export let headers: string[];
  export let rows: string[][];

  // Parse headers and cells as inline markdown
  $: parsedHeaders = headers.map((h) => marked.parseInline(h) as string);
  $: parsedRows = rows.map((row) =>
    row.map((cell) => marked.parseInline(cell) as string)
  );
</script>

<div class="table-container">
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          {#each parsedHeaders as header}
            <th>
              {@html header}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each parsedRows as row}
          <tr>
            {#each row as cell}
              <td>
                <span>
                  {@html cell}
                </span>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="postcss">
  .table-container {
    @apply w-full max-w-screen-md mx-auto my-8;
  }

  .table-wrapper {
    @apply w-full overflow-x-auto rounded-lg border border-white/5 bg-white/[0.02];
  }

  table {
    @apply w-full border-collapse font-serif text-sm md:text-base;
  }

  thead {
    @apply bg-white/5 border-b-2 border-[#efefef];
  }

  thead tr th {
    @apply text-left px-4 md:px-6 py-3 md:py-4 text-white font-semibold border-r border-white/10;
  }

  thead tr th:last-child {
    @apply border-r-0;
  }

  tbody tr {
    @apply border-b border-white/10;
  }

  tbody tr:last-child {
    @apply border-b-0;
  }

  tbody tr td {
    @apply px-4 md:px-6 py-3 md:py-4 text-description-text-grey border-r border-white/10;
  }

  tbody tr td:last-child {
    @apply border-r-0;
  }

  /* Style for inline elements within table cells */
  table :global(em) {
    @apply italic;
  }

  table :global(strong) {
    @apply font-bold text-white;
  }

  table :global(code) {
    @apply bg-white/5 text-glacial-blue px-2 py-1 rounded text-xs md:text-sm;
  }

  table :global(a) {
    @apply text-glacial-blue hover:text-white transition-colors underline;
  }
</style>

