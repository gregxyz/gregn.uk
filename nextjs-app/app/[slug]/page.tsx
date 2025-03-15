import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs } from "@/sanity/lib/queries";

type Props = {
	params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
	const { data } = await sanityFetch({
		query: pagesSlugs,
		// // Use the published perspective in generateStaticParams
		perspective: "published",
		stega: false,
	});
	return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const { data: page } = await sanityFetch({
		query: getPageQuery,
		params,
		// Metadata should never contain stega
		stega: false,
	});

	return {
		title: page?.name,
		description: page?.heading,
	} satisfies Metadata;
}

export default async function Page(props: Props) {
	const params = await props.params;
	const [{ data: page }] = await Promise.all([
		sanityFetch({ query: getPageQuery, params }),
	]);

	return (
		<div className="my-12 lg:my-24">
			<h1>inner page</h1>
		</div>
	);
}
