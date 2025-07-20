import type { GetHomeQueryResult } from "@/sanity.types";
import { dataAttr } from "@/sanity/lib/utils";
import React from "react";
import { blocks } from "./blocks";

type HomePageBuilder = NonNullable<
  NonNullable<GetHomeQueryResult>["pageBuilder"]
>;

type ContentBlock = HomePageBuilder[number];

type BlockComponentProps = {
  block: ContentBlock;
  index?: number;
  pageId?: string;
  pageType?: string;
};

type BlocksType = {
  [K in keyof typeof blocks]: React.ComponentType<{
    block: Extract<ContentBlock, { _type: K }>;
    index?: number;
    pageId?: string;
    pageType?: string;
  }>;
};

type BlockProps = {
  index: number;
  block: ContentBlock;
  pageId: string;
  pageType: string;
};

const Blocks = blocks as BlocksType;

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type as keyof BlocksType] !== "undefined") {
    const BlockComponent = Blocks[block._type as keyof BlocksType];
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(
          BlockComponent as React.ComponentType<BlockComponentProps>,
          {
            key: block._key,
            block: block,
            index: index,
            pageId: pageId,
            pageType: pageType,
          },
        )}
      </div>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full rounded bg-gray-100 p-20 text-center text-gray-500">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
