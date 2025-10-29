"use client";

import type { Project as ProjectProps } from "@/sanity.types";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import SanityImage from "./SanityImage";

function ProjectCard({ card }: { card: ProjectProps }) {
  const slug = `/project/${card.slug.current}`;

  return (
    <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
      <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-y-10 px-6 md:px-0">
        <div>
          <h3 className="text-2xl">{card.title}</h3>
          <ul className="flex text-[10px] uppercase opacity-30">
            {card.tools.map((tool) => (
              <li key={tool} className="last:[&_span:last-child]:hidden">
                <span>{tool}</span>
                <span>/</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="self-center sm:justify-self-center md:justify-self-start">
          <p className="max-w-[270px] font-heading text-3xl text-rich-black">
            {card.description}
          </p>
        </div>
        <div className="self-end text-right">
          <Link
            href={slug}
            className="link-hover-reverse link-hover-reverse--dark inline-flex items-center gap-x-1 text-sm"
          >
            <span>View project</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <Link
        href={slug}
        className="relative order-first mb-5 h-[420px] w-full md:order-last md:mb-0"
      >
        {card.previewImage && (
          <ViewTransition
            name={`project-image-${card.slug.current}`}
            share="project-image-share"
          >
            <SanityImage
              image={card.previewImage}
              alt=""
              fill={true}
              className="size-full object-cover"
            />
          </ViewTransition>
        )}
      </Link>
    </div>
  );
}

export default ProjectCard;
