"use client";

import { horizontalLoop } from "@/app/lib/gsap-utils";
import type { Hero as HeroProps } from "@/sanity.types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import RichText from "../common/RichText";

gsap.registerPlugin(SplitText);

function Hero({ block }: { block: HeroProps }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = containerRef.current?.querySelector(".hero-title");
      if (!title) return;

      const titleSplit = new SplitText(title, {
        type: "chars",
        charsClass: "split-char",
      });

      const richTextDiv = containerRef.current?.querySelector(
        ".hero-description .rich-text",
      );
      if (!richTextDiv) return;

      const descriptionSplit = new SplitText(richTextDiv, {
        type: "lines",
        linesClass: "split-line",
      });

      const marqueeContainer = containerRef.current?.querySelector(
        ".hero-marquee-container",
      ) as HTMLElement | null;

      const nav = containerRef.current?.querySelector(".hero-nav");
      const scrollButton = containerRef.current?.querySelector(
        ".hero-scroll-button",
      );

      gsap.set(
        [titleSplit.chars, nav, scrollButton, marqueeContainer].filter(Boolean),
        {
          autoAlpha: 0,
          filter: "blur(8px)",
        },
      );

      gsap.set(descriptionSplit.lines, {
        autoAlpha: 0,
        filter: "blur(8px)",
        y: 20,
      });

      containerRef.current?.classList.remove("invisible");

      const tl = gsap.timeline();

      tl.to(titleSplit.chars, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.03,
      });

      tl.to(
        descriptionSplit.lines,
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
        },
        "-=1",
      );

      tl.to(
        [nav, scrollButton, marqueeContainer].filter(Boolean),
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      );

      const marqueeItems = gsap.utils.toArray(
        ".hero-marquee-item",
      ) as HTMLElement[];

      if (marqueeItems.length > 0 && marqueeContainer) {
        const splits = marqueeItems.map(
          (item) =>
            new SplitText(item, {
              type: "chars",
              charsClass: "marquee-char",
            }),
        );

        horizontalLoop(marqueeItems, {
          speed: 0.2,
          repeat: -1,
          paddingRight: 24,
        });

        const fadeDistance = 50;
        const maxBlur = 6;
        const containerRect = marqueeContainer.getBoundingClientRect();

        gsap.ticker.add(() => {
          for (const split of splits) {
            for (const char of split.chars) {
              const charRect = char.getBoundingClientRect();
              const distanceFromLeft = charRect.left - containerRect.left;

              if (distanceFromLeft < fadeDistance) {
                const progress = Math.max(0, distanceFromLeft / fadeDistance);
                const blur = maxBlur * (1 - progress);
                gsap.set(char, {
                  autoAlpha: progress,
                  filter: `blur(${blur}px)`,
                });
              } else {
                gsap.set(char, { autoAlpha: 1, filter: "blur(0px)" });
              }
            }
          }
        });
      }
    },
    { scope: containerRef, dependencies: [block.description] },
  );

  return (
    <div
      ref={containerRef}
      className="invisible relative h-[calc(100svh-30px)] overflow-hidden py-6 pl-6 sm:py-10 sm:pl-10"
    >
      <div className="flex h-[calc(100%-30px)] flex-col justify-between">
        <div className="flex flex-col gap-x-2 md:flex-row md:items-end md:justify-between">
          <h1 className="hero-title whitespace-nowrap font-semibold text-4xl uppercase leading-[0.8] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] sm:text-6xl">
            {block.title}
          </h1>
          {!!block.skills && (
            <div className="hero-marquee-container mt-6 w-full overflow-hidden text-black md:w-[320px]">
              <ul className="mx-5 flex gap-x-6 font-light text-xs">
                {block.skills.map((skill) => (
                  <li
                    key={skill}
                    className="hero-marquee-item whitespace-nowrap"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between gap-y-10 pr-6 md:pr-10">
          <div className="hero-bottom-content flex max-w-[95%] flex-col justify-between sm:max-w-[80%] md:mt-0 md:justify-end xl:max-w-[40%]">
            {block.description && (
              <div className="hero-description">
                <RichText
                  content={block.description}
                  className="font-light text-black text-md md:text-xl"
                />
              </div>
            )}
            {!!block.links && (
              <nav className="hero-nav">
                <hr className="mt-5 mb-1 w-10 md:mt-8 md:mb-3" />
                <ul className="inline-flex justify-end gap-x-4 pr-1 text-black/70 text-sm underline md:text-md">
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
          <div className="hero-scroll-button flex items-end">
            <button type="button" className="text-md">
              (scroll)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
