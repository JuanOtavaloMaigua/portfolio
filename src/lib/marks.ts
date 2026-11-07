export interface MarkedPart {
  text: string;
  mark: boolean;
}

/**
 * Splits a translated string into plain and highlighted parts: words wrapped in *asterisks* are marked.
 * Keeps emphasis in the dictionaries (each locale picks its own words) instead of per-locale HTML.
 */
export function splitMarks(value: string): MarkedPart[] {
  return value
    .split('*')
    .map((text, index) => ({ text, mark: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}
