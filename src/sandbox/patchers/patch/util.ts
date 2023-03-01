export const DOCMARKED = '__TARGET_DOCUMENT__';
export function markDocument() {
  document[DOCMARKED] = true;
  document.body[DOCMARKED] = true;
  document.head[DOCMARKED] = true;
}
export function isTargetNode(this: Document | Node) {
  return this[DOCMARKED];
}
