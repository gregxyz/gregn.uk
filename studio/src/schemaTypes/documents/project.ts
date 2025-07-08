import {
  DocumentSheetIcon,
  DocumentTextIcon,
  ImagesIcon,
  SearchIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";
import slugify from "slugify";

const groups = [
  { name: "page", title: "Page", icon: DocumentTextIcon, default: true },
  { name: "assets", title: "Assets", icon: ImagesIcon },
  { name: "content", title: "Content", icon: DocumentSheetIcon },
  { name: "seo", title: "SEO", icon: SearchIcon },
];

const fieldsets = [{ name: "taglines", options: { columns: 2 } }];

export const project = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: ImagesIcon,
  groups: groups,
  fieldsets: fieldsets,
  fields: [
    defineField({
      group: "page",
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "page",
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input: string) =>
          slugify(input, {
            lower: true,
            strict: true,
          }),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "page",
      name: "client",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "page",
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "page",
      name: "services",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    }),
    defineField({
      group: "page",
      fieldset: "taglines",
      name: "tagline",
      title: "Primary",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "page",
      fieldset: "taglines",
      name: "secondaryTagline",
      title: "Secondary",
      type: "string",
    }),
    defineField({
      group: "page",
      name: "tools",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      group: "assets",
      name: "previewImage",
      type: "image",
      fields: [
        defineField({
          name: "attribution",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required().assetRequired(),
    }),
    defineField({
      group: "assets",
      name: "heroImage",
      type: "image",
      fields: [
        defineField({
          name: "attribution",
          type: "string",
        }),
      ],
      validation: (rule) =>
        rule.custom((heroImage, context) => {
          const hasVideo = context.document?.video;
          if (hasVideo) return true;

          return heroImage?.asset
            ? true
            : "Hero image is required unless a video is provided";
        }),
    }),
    defineField({
      group: "assets",
      name: "video",
      type: "object",
      description:
        "Video takes priority over the hero image if both are present",
      fields: [
        defineField({
          name: "file",
          type: "file",
          options: {
            accept: "video/*",
          },
        }),
        defineField({
          name: "attribution",
          type: "string",
          validation: (rule) =>
            rule.custom((attribution, context) => {
              const parentVideoObject = context.parent as {
                file?: { asset?: unknown };
              };
              const videoFileAsset = parentVideoObject?.file?.asset;

              if (videoFileAsset && !attribution) {
                return "Attribution is required for the video";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      group: "content",
      name: "description",
      type: "text",
      rows: 4,
    }),
    defineField({
      group: "content",
      name: "prompt",
      type: "richText",
      description: "Prompt to feed into AI for this project",
      validation: (rule) => rule.required(),
    }),
    // defineField({
    //   group: "content",
    //   name: "gallery",
    //   type: "array",
    //   of: [
    //     {
    //       type: "image",
    //       validation: (rule) => rule.required().assetRequired().min(2),
    //     },
    //   ],
    // }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "previewImage",
    },
  },
});
