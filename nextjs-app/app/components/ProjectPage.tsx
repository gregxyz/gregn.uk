import type { Project } from "@/sanity.types";
import { ArrowLeft, OpenAiLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import IconGemini from "../assets/svg/IconGemini";
import RichText from "./common/RichText";
import SanityImage from "./common/SanityImage";

type ProjectPageProps = {
  project: Project;
};

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="mb-10 md:mb-5">
      <div className="bg-[#000] pt-8">
        <div className="flex justify-between px-6 text-white md:px-10">
          <Link
            href="/"
            className="link-hover-reverse inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="text-sm uppercase tracking-widest">Back</span>
          </Link>
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
            <h2 className="max-w-[560px] font-thin text-base tracking-wide opacity-50">
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
            <figure className="h-[200px] w-full md:h-[85vh]">
              <SanityImage
                image={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </figure>
          )}
        </div>
      </div>
      <article className="mt-10 px-6 md:px-10 lg:mt-20 lg:px-20">
        <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-20">
          <div>
            <h3 className="mb-4 text-black/40 text-xs uppercase tracking-widest">
              Overview_
            </h3>
            <div className="lg:w-[80%]">
              <div className="bg-gray-50 p-4 font-light text-[12px]">
                <h4 className="mb-6 text-black/50 text-xs uppercase tracking-widest">
                  Prompt
                </h4>
                <div className="opacity-50">
                  <RichText content={project.prompt} />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-grey-700 leading-7">
            <div className="flex flex-col gap-y-1 text-xs opacity-50">
              <div className="w-[60px]">
                <IconGemini />
              </div>
              <span>Powered by Gemini 2.5 Flash-Lite Preview</span>
            </div>
          </div>
        </div>
      </article>
      <div className="mt-20 px-6 text-center md:mt-40">
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
