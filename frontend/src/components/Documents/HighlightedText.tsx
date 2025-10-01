interface HighlightedTextProps {
  text: string;
  range: { start: number; end: number };
}

export function HighlightedText({ text, range }: HighlightedTextProps) {
  return (
    <p className="break-words whitespace-pre-wrap">
      {text.slice(0, range.start)}
      <span className="bg-yellow-200">
        {text.slice(range.start, range.end)}
      </span>
      {text.slice(range.end)}
    </p>
  );
}
