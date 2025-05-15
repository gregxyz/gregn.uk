import { PresentationIcon } from "@sanity/icons";
import { defineField } from "sanity";

export const hero = defineField({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: PresentationIcon,
  fields: [
    defineField({
      name: "title",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLarge",
      title: "Large title",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "richText",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [
        {
          name: "link",
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
            },
            {
              name: "url",
              type: "url",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
