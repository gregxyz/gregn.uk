import { sanityFetch } from "@/sanity/lib/live";
import { getHomeQuery } from "@/sanity/lib/queries";
import BlockRenderer from "./components/BlockRenderer";
import Footer from "./components/core/Footer";

export default async function Page() {
  const { data: page } = await sanityFetch({
    query: getHomeQuery,
  });

  return (
    <>
      {page?.pageBuilder?.map((block, index) => (
        <BlockRenderer
          key={block._key}
          block={block}
          index={index}
          pageId={page._id}
          pageType={page._type}
        />
      ))}
      <Footer />
    </>
  );
}
