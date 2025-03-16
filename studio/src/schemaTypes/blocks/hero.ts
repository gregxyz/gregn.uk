import { defineField } from "sanity";
import { PresentationIcon } from "@sanity/icons";

export const hero = defineField({
	name: "hero",
	title: "Hero",
	type: "object",
	icon: PresentationIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
