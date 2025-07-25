import type { SanityImageCrop, SanityImageHotspot } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image, { type ImageProps } from "next/image";

// Image type that includes LQIP while preserving original asset reference structure
export type SanityImageSource = {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  attribution?: string;
  _type: "image";
  lqip?: string | null; // LQIP data added directly to image object
};

export type SanityImageProps = Omit<ImageProps, "src" | "alt"> & {
  image: SanityImageSource | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  /** Image quality from 1-100. Default: 90 */
  quality?: number;
  /** How the image should fit within the given dimensions. Default: "max" */
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  /** Auto format. Default: "format" */
  auto?: "format";
  /** Blur radius from 0-100 */
  blur?: number;
  /** Sharpen amount from 0-100 */
  sharpen?: number;
  // Allow Next.js Image props to be overridden
  placeholder?: "blur" | "empty" | `data:image/${string}`;
  blurDataURL?: string;
};

/**
 * SanityImage component that handles Sanity CMS images with proper hotspot and crop handling.
 *
 * @example
 * // Basic usage
 * <SanityImage image={project.heroImage} alt="Hero image" width={800} height={600} />
 *
 * @example
 * // Fill container with responsive sizes
 * <SanityImage
 *   image={project.heroImage}
 *   alt="Hero image"
 *   fill
 *   className="object-cover"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 *
 * @example
 * // Thumbnail with crop
 * <SanityImage
 *   image={project.thumbnail}
 *   alt="Thumbnail"
 *   width={200}
 *   height={200}
 *   fit="crop"
 *   quality={75}
 * />
 */
export default function SanityImage({
  image,
  alt = "",
  width,
  height,
  quality = 90,
  fit = "max",
  auto = "format",
  blur,
  sharpen,
  className,
  ...nextImageProps
}: SanityImageProps) {
  // Check if we have a valid asset reference
  if (!image?.asset?._ref) {
    return null;
  }

  // Start building the image URL
  let imageBuilder = urlForImage(image);

  if (!imageBuilder) {
    return null;
  }

  // Apply transformations
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  if (quality) imageBuilder = imageBuilder.quality(quality);
  if (fit) imageBuilder = imageBuilder.fit(fit);
  if (auto) imageBuilder = imageBuilder.auto(auto);
  if (blur) imageBuilder = imageBuilder.blur(blur);
  if (sharpen) imageBuilder = imageBuilder.sharpen(sharpen);

  const imageUrl = imageBuilder.url();

  if (!imageUrl) {
    return null;
  }

  // Generate blur data URL from Sanity LQIP
  const blurDataURL = image.lqip || undefined;

  return (
    <Image
      src={imageUrl}
      alt={alt || image.attribution || ""}
      width={width}
      height={height}
      className={className}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      {...nextImageProps}
    />
  );
}
