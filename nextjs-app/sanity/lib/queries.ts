import { defineQuery } from "next-sanity";
import { pageStub } from "./queryStubs";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "project": project->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getHomeQuery = defineQuery(`
  *[_type == 'home'][0]{
    ${pageStub}
  }
`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    ${pageStub}
  }
`);

export const getProjectQuery = defineQuery(`
  *[_type == 'project' && slug.current == $slug][0]{
    ...,
  }
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const projectsSlugs = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`);

export const allSlugs = defineQuery(`
  *[(_type == "page" || _type == "project") && defined(slug.current)]
  {"slug": slug.current, "_type": _type}
`);
