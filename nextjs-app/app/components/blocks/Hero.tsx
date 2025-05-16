"use client";

import type { Hero as HeroProps } from "@/sanity.types";
import { ArrowElbowRightDown } from "@phosphor-icons/react";
import Image from "next/image";
import RichText from "../common/RichText";

function Hero({ block }: { block: HeroProps }) {
  return (
    <section className="relative flex h-dvh flex-col bg-grid px-6 py-10 md:px-20 md:py-16">
      <div className="mb-5 grid-cols-2 md:mb-0 md:grid">
        <div className="relative z-20 mb-4 md:mb-0">
          <h1 className="whitespace-pre-line font-bold text-fluid-xl">
            {block.title}
          </h1>
        </div>
        <div className="max-w-[400px] md:ml-auto md:place-self-end md:text-right xl:max-w-[30vw]">
          {block.description && <RichText content={block.description} />}
          {!!block.links && (
            <nav>
              <hr className="mt-2 mb-1 w-7 md:ml-auto" />
              <ul className="inline-flex justify-end space-x-2 pr-1 text-xs underline opacity-50">
                {block.links.map((link) => (
                  <li key={link._key}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
      <div className="relative z-10 flex h-full flex-col md:flex-row md:justify-between">
        <div className="md:-ml-10 md:-mt-15 lg:-mt-6 relative size-full min-w-[200px] shrink-0 overflow-hidden md:h-[75vh] md:w-[18vw]">
          <Image
            src="/images/hero-demo.jpg"
            alt=""
            fill={true}
            className="size-full object-cover"
          />
          <button
            type="button"
            className="before:-z-10 absolute right-0 bottom-0 z-10 flex w-[90%] cursor-pointer justify-between gap-x-2 py-2 pl-4 text-left before:absolute before:inset-x-0 before:bottom-0 before:size-full before:bg-white before:transition-height before:duration-300 hover:before:h-[60%]"
          >
            <span className="text-white mix-blend-difference">
              View projects
            </span>
            <ArrowElbowRightDown
              size={26}
              className="text-white mix-blend-difference"
            />
          </button>
        </div>
        <div className="@container hidden w-full justify-end self-end md:flex">
          <h2 className="whitespace-pre-line text-right font-bold text-[16cqw] leading-[16cqw] tracking-[0.5vw]">
            {block.titleLarge}
          </h2>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-[120px] bg-linear-to-t from-white to-transparent" />
    </section>
  );
}

export default Hero;
