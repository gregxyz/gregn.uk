import { defineField } from "sanity";

import * as blocks from "../blocks";

export const contentBlocks = defineField({
	name: "contentBlocks",
	title: "Page builder",
	type: "array",
	of: Object.values(blocks).map((blockType) => ({
		type: blockType.name,
		ref: blockType.name,
	})),
	options: {
		insertMenu: {
			views: [
				{
					name: "grid",
					previewImageUrl: (schemaTypeName) =>
						`/static/page-builder-thumbnails/${schemaTypeName}.webp`,
				},
			],
		},
	},
});
