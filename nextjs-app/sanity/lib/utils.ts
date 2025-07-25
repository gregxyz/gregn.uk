import type { Link } from "@/sanity.types";
import { dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { getFileAsset } from "@sanity/asset-utils";
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
  // Check if we have an expanded asset (with _id but _ref is null)
  if (source?.asset?._id && source.asset._ref === null) {
    return imageBuilder
      ?.image(source.asset)
      .auto("format")
      .quality(90)
      .fit("max");
  }

  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  // We have a reference, pass the full source object
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
      break;
    case "project":
      if (link?.project && typeof link.project === "string") {
        return `/project/${link.project}`;
      }
      break;
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
