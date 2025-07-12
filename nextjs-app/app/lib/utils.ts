export interface WordSegment {
  id: string;
  text: string;
  type: "word" | "line-break" | "paragraph-break";
}

export function processTextToSegments(text: string): WordSegment[] {
  const segments = text.split(/(\s+|\n+)/);
  const processedSegments = segments
    .filter(Boolean)
    .map((segment): { type: WordSegment["type"]; text: string } => {
      if (segment.match(/\n{2,}/)) {
        return { type: "paragraph-break", text: segment };
      }
      if (segment.match(/\n/)) {
        return { type: "line-break", text: segment };
      }
      return { type: "word", text: segment };
    });

  return processedSegments.map((segment, index) => ({
    id: `segment-${index}`,
    text: segment.text,
    type: segment.type,
  }));
}
