import { defineField } from "sanity";

export const richText = defineField({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    {
      type: "block",
    },
  ],
});
