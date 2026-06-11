type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * Serialize JSON-LD safely for inlining inside a <script> tag.
 *
 * `JSON.stringify` alone is unsafe here : any `<` in the data (e.g. a CMS
 * post title containing `</script>`) would close the tag early and allow
 * HTML/script injection (stored XSS). Escaping `<`, `>` and `&` to their
 * `\uXXXX` forms keeps the output valid JSON-LD — consumers decode the
 * escapes — while making `</script>` impossible to express.
 */
function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
