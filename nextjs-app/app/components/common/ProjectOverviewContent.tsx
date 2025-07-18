"use client";

import IconGemini from "@/app/assets/svg/IconGemini";
import { type WordSegment, processTextToSegments } from "@/app/lib/utils";
import type { RichText } from "@/sanity.types";
import { useGSAP } from "@gsap/react";
import { isAfter } from "date-fns";
import { gsap } from "gsap";
import { toPlainText } from "next-sanity";
import { useEffect, useRef, useState } from "react";

interface ProjectOverviewContentProps {
  prompt: RichText;
  slug: string;
}

function ProjectOverviewContent({ prompt, slug }: ProjectOverviewContentProps) {
  const [words, setWords] = useState<WordSegment[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const poweredByRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isInView]);

  useGSAP(() => {
    if (!isInView || words.length === 0) return;

    const wordElements = ref.current?.querySelectorAll(".word");
    if (!wordElements) return;

    gsap.set(wordElements, { opacity: 0, y: 10 });
    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.out",
      onComplete: () => setIsComplete(true),
    });
  }, [isInView, words]);

  useGSAP(() => {
    if (!isComplete || !poweredByRef.current) return;

    gsap.fromTo(
      poweredByRef.current,
      { opacity: 0 },
      {
        opacity: 0.5,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  }, [isComplete]);

  useEffect(() => {
    if (!prompt || !slug) return;

    setWords([]);
    setIsComplete(false);

    const checkCachedContent = () => {
      try {
        const cachedContent = localStorage.getItem(slug);
        const cacheExpiry = localStorage.getItem(`${slug}-expire`);

        if (cachedContent && cacheExpiry) {
          const expiryDate = new Date(cacheExpiry);
          const now = new Date();

          if (isAfter(expiryDate, now)) {
            const finalWords = processTextToSegments(cachedContent);
            setWords(finalWords);
            return true;
          }
        }
        return false;
      } catch (error) {
        return false;
      }
    };

    if (checkCachedContent()) return;

    const generateContent = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: toPlainText(prompt) }),
        });

        const reader = response.body?.getReader();
        if (!reader) return;

        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          accumulatedText += chunk;
        }

        try {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 1);

          localStorage.setItem(slug, accumulatedText);
          localStorage.setItem(`${slug}-expire`, expiryDate.toISOString());
        } catch {
          //
        }

        const finalWords = processTextToSegments(accumulatedText);
        setWords(finalWords);
      } catch {
        //
      }
    };

    generateContent();
  }, [prompt, slug]);

  return (
    <div ref={ref}>
      <h3 className="mb-4 text-black/40 text-xs uppercase tracking-widest">
        Overview_
      </h3>
      {words.length > 0 && isInView && (
        <div className="mb-4 text-sm">
          {words.map((segment, index) => {
            if (segment.type === "paragraph-break") {
              return (
                <div
                  key={segment.id}
                  className="word h-4"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                />
              );
            }
            if (segment.type === "line-break") {
              return (
                <br
                  key={segment.id}
                  className="word"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                />
              );
            }
            return (
              <span
                key={segment.id}
                className="word"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {segment.text}
              </span>
            );
          })}
        </div>
      )}

      {isComplete && (
        <div ref={poweredByRef} className="flex flex-col gap-y-1 text-xs">
          <div className="w-[60px]">
            <IconGemini />
          </div>
          <span>Powered by Gemini 2.5 Flash-Lite Preview</span>
        </div>
      )}
    </div>
  );
}

export default ProjectOverviewContent;
