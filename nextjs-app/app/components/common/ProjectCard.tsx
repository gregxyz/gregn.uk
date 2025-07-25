"use client";
import type { Project as ProjectProps } from "@/sanity.types";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import { AnimateFadeUp } from "./AnimateFadeUp";
import SanityImage from "./SanityImage";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  card,
  animationDelay = 0,
}: { card: ProjectProps; animationDelay?: number }) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !overlayRef.current) return;

    const overlay = overlayRef.current;

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.6,
      delay: animationDelay + 0.1,
      ease: "expo.in",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
      },
    });
  }, []);

  return (
    <Link
      ref={containerRef}
      href={`/project/${card.slug.current}`}
      className="group relative flex h-full flex-col border-black/10 before:absolute before:top-0 before:left-0 before:z-1 before:h-0.25 before:w-0 before:bg-[#000] before:transition-all before:duration-200 hover:before:w-full sm:border-t sm:pt-4"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-6 sm:px-0">
        <AnimateFadeUp delay={animationDelay}>
          <h3 className="shrink-0">{card.title}</h3>
        </AnimateFadeUp>
        <AnimateFadeUp delay={animationDelay + 0.1}>
          <ul className="flex text-[10px] uppercase opacity-30">
            {card.tools.map((tool) => (
              <li key={tool} className="last:[&_span:last-child]:hidden">
                <span>{tool}</span>
                <span>/</span>
              </li>
            ))}
          </ul>
        </AnimateFadeUp>
      </div>
      <div className="mt-auto h-[420px] w-full bg-grey-900 px-6 py-10 transition-colors duration-400 group-hover:bg-grey-600/5 sm:p-10">
        <div className="relative size-full overflow-hidden rounded-[2px]">
          {card.previewImage && (
            <ViewTransition name={`project-image-${card.slug.current}`}>
              <SanityImage
                image={card.previewImage}
                alt=""
                fill={true}
                className="size-full object-cover"
              />
            </ViewTransition>
          )}
          <div ref={overlayRef} className="absolute inset-0 bg-grey-900" />
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
