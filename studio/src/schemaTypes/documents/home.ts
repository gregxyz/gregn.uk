import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const home = defineType({
	name: "home",
	title: "Home",
	type: "document",
	icon: HomeIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			initialValue: "Home Page",
			hidden: true,
		}),
		defineField({
			name: "pageBuilder",
			title: "Page builder",
			type: "contentBlocks",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
