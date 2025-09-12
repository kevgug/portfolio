<script lang="ts">
  import { onMount } from "svelte";
  import hljs from "highlight.js";

  export let code: string;
  export let lang: string | undefined;

  let highlightedCode = "";

  onMount(() => {
    if (lang && hljs.getLanguage(lang)) {
      highlightedCode = hljs.highlight(code, { language: lang }).value;
    } else {
      highlightedCode = hljs.highlightAuto(code).value;
    }
  });
</script>

<pre><code class="hljs {lang || ''}">{@html highlightedCode}</code></pre>
