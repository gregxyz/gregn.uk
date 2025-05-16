import type { RichText as RichTextType } from "@/sanity.types";
import { PortableText } from "next-sanity";

function RichText({ content }: { content: RichTextType }) {
  return (
    <div>
      <PortableText value={content} />
    </div>
  );
}

export default RichText;
