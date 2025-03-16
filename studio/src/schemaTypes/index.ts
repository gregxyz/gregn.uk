import * as documents from "./documents";
import * as singletons from "./singletons";
import * as objects from "./objects";
import * as blocks from "./blocks";

const allDocuments = Object.values(documents);
const allSingletons = Object.values(singletons);
const allObjects = Object.values(objects);
const allBlocks = Object.values(blocks);

export const schemaTypes = [
	...allDocuments,
	...allSingletons,
	...allObjects,
	...allBlocks,
];
