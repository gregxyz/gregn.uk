import { page } from "./documents/page";
import { settings } from "./singletons/settings";
import { link } from "./objects/link";

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
	// Singletons
	settings,
	// Documents
	page,
	// Objects
	link,
];
