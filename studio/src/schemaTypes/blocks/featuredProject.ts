import { ImageIcon } from "@sanity/icons";
import { defineField } from "sanity";

export const featuredProject = defineField({
  name: "featuredProject",
  title: "Featured project",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "project",
      type: "reference",
      to: [{ type: "project" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "project.title",
      media: "project.previewImage",
    },
    prepare({ title, media }) {
      return {
        title: title,
        media: media,
        subtitle: "Featured project",
      };
    },
  },
});
