export const pageStub = `
  _id,
  _type,
  name,
  slug,
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "featuredProject" => {
      ...,
      project-> {
       ...,
      },
    },
    _type == "projectList" => {
      ...,
      projects[]-> {
       ...,
      },
    },
  },
`;
