import type { RichText as RichTextType } from "@/sanity.types";
import { PortableText } from "next-sanity";

interface RichTextProps {
  content: RichTextType;
  className?: string;
}

function RichText({ content, className }: RichTextProps) {
  return (
    <div className={`rich-text${className ? ` ${className}` : ""}`}>
      <PortableText value={content} />
    </div>
  );
}

export default RichText;
