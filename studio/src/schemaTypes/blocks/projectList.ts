import { ImagesIcon } from "@sanity/icons";
import { defineField } from "sanity";

export const projectList = defineField({
  name: "projectList",
  title: "Project list",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Project list",
      };
    },
  },
});
