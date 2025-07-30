"use client";
import type { Project as ProjectProps } from "@/sanity.types";
import { getFileAssetSource } from "@/sanity/lib/utils";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { AnimateFadeUp } from "../common/AnimateFadeUp";
import SanityImage from "../common/SanityImage";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  block: {
    project: ProjectProps;
  };
}

function FeaturedProject({ block }: Props) {
  const { project } = block;
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const projectSlug = `/project/${project.slug.current}`;

  const video = project.video?.file
    ? getFileAssetSource(project.video.file)
    : null;

  useGSAP(
    () => {
      if (!elementRef.current) return;

      gsap.fromTo(
        elementRef.current,
        { width: "90%" },
        {
          width: "100%",
          ease: "power3.out",
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top bottom",
            end: "45% bottom",
            scrub: true,
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="featured-project mt-5 md:mt-20">
      <div
        ref={elementRef}
        className="relative mx-auto h-svh min-h-[700px] w-[95%] bg-[#000]"
      >
        <div className="flex size-full flex-col py-8 md:py-10">
          <div className="mb-6 flex flex-col justify-between px-6 md:mb-10 md:flex-row md:items-center md:px-10">
            <div className="flex">
              <AnimateFadeUp start="top 70%">
                <Link href={projectSlug} className="link-hover-reverse">
                  <h2 className="font-light text-white text-xl uppercase tracking-widest">
                    {project.title}
                  </h2>
                </Link>
              </AnimateFadeUp>
            </div>
            <AnimateFadeUp start="top 70%" delay={0.1}>
              <ul className="mt-1 flex flex-wrap font-light text-white text-xs uppercase tracking-widest opacity-60 md:mt-0 md:opacity-100">
                {project.tools.map((tool) => (
                  <li key={tool} className="last:[&_span:last-child]:hidden">
                    <span>{tool}</span>
                    <span>/</span>
                  </li>
                ))}
              </ul>
            </AnimateFadeUp>
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
                project.heroImage && (
                  <SanityImage
                    image={project.heroImage}
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
            <AnimateFadeUp start="top bottom" delay={0.4} duration={1}>
              <Link
                href={projectSlug}
                className="link-hover flex items-center gap-x-1"
              >
                <span>View project</span>
                <ArrowRight size={12} />
              </Link>
            </AnimateFadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProject;
