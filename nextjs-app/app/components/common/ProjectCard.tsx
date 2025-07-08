"use client";
import type { Project as ProjectProps } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import Link from "next/link";

function ProjectCard({ card }: { card: ProjectProps }) {
  const projectImage = urlForImage(card.previewImage)?.url();

  return (
    <Link
      href={`/project/${card.slug.current}`}
      className="group relative flex h-full flex-col border-black/10 before:absolute before:top-0 before:left-0 before:z-1 before:h-0.25 before:w-0 before:bg-[#000] before:transition-all before:duration-200 hover:before:w-full sm:border-t sm:pt-4"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-6 sm:px-0">
        <h3 className="shrink-0">{card.title}</h3>
        <ul className="flex text-[10px] uppercase opacity-30">
          {card.tools.map((tool) => (
            <li key={tool} className="last:[&_span:last-child]:hidden">
              <span>{tool}</span>
              <span>/</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto h-[420px] w-full bg-grey-600/10 px-6 py-10 transition-colors duration-400 group-hover:bg-grey-600/5 sm:p-10">
        <div className="relative size-full overflow-hidden rounded-[2px] drop-shadow-md">
          {projectImage && (
            <Image
              src={projectImage}
              alt=""
              fill={true}
              className="size-full object-cover"
            />
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
