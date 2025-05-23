import type { Project as ProjectProps } from "@/sanity.types";
import { getFileAssetSource, urlForImage } from "@/sanity/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

interface Props {
  block: {
    project: ProjectProps;
  };
}

function FeaturedProject({ block }: Props) {
  const { project } = block;

  const projectSlug = `/project/${project.slug.current}`;

  const video = project.video?.file
    ? getFileAssetSource(project.video.file)
    : null;

  const image = project.heroImage?.asset
    ? urlForImage(project.heroImage)?.url()
    : null;

  return (
    <section className="mt-5 md:mt-20">
      <div className="relative h-dvh min-h-[700px] w-full bg-[#000]">
        <div className="flex size-full flex-col py-8 md:py-10">
          <div className="mb-6 flex flex-col justify-between px-6 md:mb-10 md:flex-row md:items-center md:px-10">
            <div className="flex">
              <Link href={projectSlug} className="link-hover-reverse">
                <h2 className="font-light text-white text-xl uppercase tracking-widest">
                  {project.title}
                </h2>
              </Link>
            </div>
            <ul className="mt-1 flex flex-wrap font-light text-white text-xs uppercase tracking-widest opacity-60 md:mt-0 md:opacity-100">
              {project.tools.map((tool, index) => (
                <li key={tool} className="last:[&_span:last-child]:hidden">
                  <span>{tool}</span>
                  <span>/</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="size-full md:px-20">
            <div className="relative size-full">
              {video ? (
                <video
                  className="absolute inset-0 size-full object-cover"
                  preload="auto"
                  autoPlay
                  muted
                  playsInline
                  loop
                >
                  <source src={video.url} type={`video/${video.extension}`} />
                </video>
              ) : (
                image && (
                  <Image
                    src={image}
                    alt={project.heroImage?.attribution || ""}
                    className="object-cover"
                    sizes="100vw"
                    fill={true}
                  />
                )
              )}
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between gap-x-2 px-6 font-light text-white text-xs uppercase tracking-widest sm:items-center md:mt-10 md:px-10">
            <div>
              <p className="opacity-50">{project.tagline}</p>
              {project.secondaryTagline && (
                <p className="mt-1 opacity-50 sm:hidden">
                  {project.secondaryTagline}
                </p>
              )}
            </div>
            {project.secondaryTagline && (
              <p className="hidden opacity-50 sm:block">
                {project.secondaryTagline}
              </p>
            )}
            <Link
              href={projectSlug}
              className="link-hover flex items-center gap-x-1"
            >
              <span>View project</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProject;
