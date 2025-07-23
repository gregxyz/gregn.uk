import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlockRenderer from "@/app/components/BlockRenderer";
import ProjectPage from "@/app/components/ProjectPage";
import Footer from "@/app/components/core/Footer";
import type { GetPageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import {
  allSlugs,
  getPageQuery,
  getProjectQuery,
  settingsQuery,
} from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string[] }>;
};

type PageWithBuilder = Omit<NonNullable<GetPageQueryResult>, "pageBuilder"> & {
  pageBuilder?: NonNullable<NonNullable<GetPageQueryResult>["pageBuilder"]>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: allSlugs,
    // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });

  const params = [];

  if (data) {
    for (const item of data) {
      if (item._type === "project") {
        // Projects are accessed via /project/[slug]
        params.push({ slug: ["project", item.slug] });
      } else if (item._type === "page") {
        // Pages are accessed via /[slug]
        params.push({ slug: [item.slug] });
      }
    }
  }

  return params;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slugArray = params.slug || [];

  if (slugArray.length === 0) {
    return {
      title: "Not Found",
    };
  }

  const [firstSlug, secondSlug] = slugArray;

  switch (firstSlug) {
    case "project": {
      if (secondSlug) {
        const { data: project } = await sanityFetch({
          query: getProjectQuery,
          params: { slug: secondSlug },
          stega: false,
        });

        if (project) {
          return {
            title: project.title,
            description: project.tagline,
          } satisfies Metadata;
        }
      }
      break;
    }

    default: {
      // For all other routes, treat as regular pages
      const { data: page } = await sanityFetch({
        query: getPageQuery,
        params: { slug: firstSlug },
        stega: false,
      });

      if (page) {
        return {
          title: page.name,
          description: page.name,
        } satisfies Metadata;
      }
      break;
    }
  }

  return {
    title: "Not Found",
  };
}

export default async function Page(props: Props) {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  const params = await props.params;
  const slugArray = params.slug || [];

  if (slugArray.length === 0) {
    notFound();
  }

  const [firstSlug, secondSlug] = slugArray;

  switch (firstSlug) {
    case "project": {
      if (!secondSlug) {
        notFound();
      }

      const { data: project } = await sanityFetch({
        query: getProjectQuery,
        params: { slug: secondSlug },
      });

      if (!project) {
        notFound();
      }

      return (
        <>
          <ProjectPage project={project} settings={settings} />
          <Footer />
        </>
      );
    }

    default: {
      // For all other routes, treat as regular pages
      const { data: page } = await sanityFetch({
        query: getPageQuery,
        params: { slug: firstSlug },
      });

      if (!page) {
        notFound();
      }

      const typedPage = page as unknown as PageWithBuilder;

      return (
        <>
          {typedPage.pageBuilder?.map((block, index) => (
            <BlockRenderer
              key={block._key}
              block={block}
              index={index}
              pageId={typedPage._id}
              pageType={typedPage._type}
            />
          ))}
          <Footer />
        </>
      );
    }
  }
}
