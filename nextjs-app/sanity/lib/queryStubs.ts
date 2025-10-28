export const imageWithMetadata = `{
  ...,
  "lqip": asset->metadata.lqip
}`;

export const pageStub = `
  _id,
  _type,
  name,
  slug,
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "hero" => {
      ...,
      image ${imageWithMetadata}
    },
    _type == "featuredProject" => {
      ...,
      project-> {
       ...,
       previewImage ${imageWithMetadata},
       heroImage ${imageWithMetadata}
      },
    },
    _type == "videoProject" => {
      ...,
      project-> {
       ...,
       previewImage ${imageWithMetadata},
       heroImage ${imageWithMetadata}
      },
    },
    _type == "projectList" => {
      ...,
      projects[]-> {
       ...,
       previewImage ${imageWithMetadata}
      },
    },
  },
`;
