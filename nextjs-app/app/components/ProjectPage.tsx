"use client";
import type { Project, SettingsQueryResult } from "@/sanity.types";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useRef } from "react";
import ProjectOverviewContent from "./common/ProjectOverviewContent";
import RichText from "./common/RichText";
import SanityImage from "./common/SanityImage";

type ProjectPageProps = {
  project: Project;
  settings?: SettingsQueryResult;
};

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage({ project, settings }: ProjectPageProps) {
  const promptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      return router.back();
    }

    router.push("/");
  };

  useGSAP(
    () => {
      if (!settings?.basePrompt) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: promptRef.current,
          start: "30% bottom",
        },
      });

      gsap.set(".base-prompt", { opacity: 1 });
      gsap.set(".project-prompt", { opacity: 0.5 });

      tl.to(
        ".base-prompt",
        {
          opacity: 0.5,
          duration: 0.5,
          ease: "power2.out",
        },
        8,
      ).to(
        ".project-prompt",
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<",
      );
    },
    { scope: promptRef },
  );

  return (
    <div className="mb-10 md:mb-5">
      <div className="bg-[#000] pt-8">
        <div className="flex justify-between px-6 text-white md:px-10">
          <button
            type="button"
            onClick={handleBack}
            className="link-hover-reverse inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="text-sm uppercase tracking-widest">Back</span>
          </button>
          <div className="">
            <p className="text-right leading-[0.8] opacity-30">
              G
              <br />N
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col px-10 pt-10 pb-12 text-white md:grid md:grid-cols-2 md:px-20 md:pt-20 md:pb-30">
          <header className="mb-10 md:order-last md:mb-0">
            <h1 className="font-medium text-fluid-2xl text-white">
              {project.title}
            </h1>
            <h2 className="mt-2 max-w-[560px] font-light text-sm tracking-wide opacity-50 md:text-base">
              {project.description || project.tagline}
            </h2>
          </header>
          <div className="space-y-8 font-light">
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest opacity-30 md:text-sm">
                Client
              </p>
              <p className="md:text-lg">{project.client}</p>
            </div>
            {!!project.services && (
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest opacity-30 md:text-sm">
                  Services
                </p>
                <ul className="space-y-1 md:text-lg">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative px-6 before:absolute before:inset-0 before:h-1/3 before:bg-[#000] md:px-10">
        <div className="relative">
          {project.heroImage && (
            <ViewTransition
              name={`project-image-${project.slug?.current}`}
              share="project-image-share"
            >
              <figure className="relative h-[320px] w-full md:h-[85vh]">
                <SanityImage
                  image={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </figure>
            </ViewTransition>
          )}
        </div>
      </div>
      <article className="mt-10 px-6 md:px-10 lg:mt-20 lg:px-20">
        <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 xl:gap-x-20">
          <div className="order-last lg:order-first">
            <div ref={promptRef} className="lg:w-[80%]">
              {settings?.basePrompt && (
                <div className="base-prompt border-b border-b-white bg-gray-50/80 p-4 font-light">
                  <h4 className="mb-6 text-xs uppercase tracking-widest">
                    Base prompt
                  </h4>
                  <p className="text-xs">{settings?.basePrompt}</p>
                </div>
              )}
              <div className="project-prompt bg-gray-50 p-4 font-light text-[12px] opacity-50">
                <h4 className="mb-6 text-black text-xs uppercase tracking-widest">
                  Project prompt
                </h4>
                <div>
                  <RichText content={project.prompt} />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-grey-700 leading-7">
            <ProjectOverviewContent
              prompt={project.prompt}
              slug={project.slug?.current || ""}
            />
          </div>
        </div>
      </article>
      <div className="mt-20 px-6 text-center md:pt-40">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="font-thin text-[80px] lowercase tracking-widest underline md:text-[120px]"
        >
          Visit project
        </a>
      </div>
    </div>
  );
}
