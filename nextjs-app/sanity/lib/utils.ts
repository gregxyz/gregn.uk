import type {
  Link,
  SanityAssetSourceData,
  SanityFileAsset,
} from "@/sanity.types";
import { dataset, projectId, studioUrl } from "@/sanity/lib/api";
import {
  SanityAsset,
  SanityAssetSource,
  type SanityFileSource,
  getFileAsset,
} from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import {
  type CreateDataAttributeProps,
  createDataAttribute,
} from "next-sanity";
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: any) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").quality(90).fit("max");
};

export const getFileAssetSource = (source: any) => {
  if (!source?.asset?._ref) {
    return undefined;
  }
  return getFileAsset(source, {
    projectId: projectId,
    dataset: dataset,
  });
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | undefined) {
  if (!link) return null;

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = "href";
  }

  switch (link.linkType) {
    case "href":
      return link.href || null;
    case "page":
      if (link?.page && typeof link.page === "string") {
        return `/${link.page}`;
      }
    case "post":
      if (link?.post && typeof link.post === "string") {
        return `/posts/${link.post}`;
      }
    default:
      return null;
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, "id" | "type" | "path">>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}

export interface WordSegment {
  id: string;
  text: string;
  type: "word" | "line-break" | "paragraph-break";
}

export function processTextToSegments(text: string): WordSegment[] {
  const segments = text.split(/(\s+|\n+)/);
  const processedSegments = segments
    .filter(Boolean)
    .map((segment): { type: WordSegment["type"]; text: string } => {
      if (segment.match(/\n{2,}/)) {
        return { type: "paragraph-break", text: segment };
      }
      if (segment.match(/\n/)) {
        return { type: "line-break", text: segment };
      }
      return { type: "word", text: segment };
    });

  return processedSegments.map((segment, index) => ({
    id: `segment-${index}`,
    text: segment.text,
    type: segment.type,
  }));
}
