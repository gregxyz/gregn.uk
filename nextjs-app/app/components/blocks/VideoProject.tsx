"use client";
import type { Project as ProjectProps } from "@/sanity.types";
import { getFileAssetSource } from "@/sanity/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  block: {
    project: ProjectProps;
  };
}

function VideoProject({ block }: Props) {
  const { project } = block;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const video = project.video?.file
    ? getFileAssetSource(project.video.file)
    : null;

  useEffect(() => {
    const container = containerRef.current;
    const videoElement = videoRef.current;

    if (!container || !videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.7 &&
          !hasPlayed
        ) {
          videoElement.play();
          setHasPlayed(true);
        }
      },
      {
        threshold: 0.7,
      },
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [hasPlayed]);

  return (
    <section
      ref={containerRef}
      className="video-project relative overflow-hidden bg-white pt-15 md:pt-20"
    >
      <h2 className="mb-2 text-center font-light text-2xl text-black uppercase tracking-widest">
        {project.title}
      </h2>
      {project.subtitle && (
        <p className="px-6 text-center font-light text-black text-xs uppercase tracking-widest opacity-70 md:px-0">
          {project.subtitle}
        </p>
      )}
      <div className="flex size-full items-center justify-center pb-7">
        {video ? (
          <video
            ref={videoRef}
            className="aspect-square size-full object-cover md:aspect-auto md:object-contain"
            preload="auto"
            muted
            playsInline
          >
            <source src={video.url} type={`video/${video.extension}`} />
          </video>
        ) : null}
      </div>
      <div className="relative flex flex-col items-center px-6 md:px-0">
        {project.description && (
          <p className="relative z-20 max-w-[500px] text-center font-light text-black text-xs uppercase tracking-widest">
            {project.description}
          </p>
        )}
        {!project.url && (
          <div className="absolute right-0 bottom-[60%] left-0 before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-10% before:from-white before:to-transparent sm:bottom-0">
            <p className="whitespace-nowrap text-center text-[14vw] uppercase opacity-5 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] md:text-[10vw]">
              Coming soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoProject;
