"use client";

import IconGemini from "@/app/assets/svg/IconGemini";
import { type WordSegment, processTextToSegments } from "@/app/lib/utils";
import type { RichText } from "@/sanity.types";
import { isAfter } from "date-fns";
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
  const [streamingWords, setStreamingWords] = useState<WordSegment[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (!isInView || words.length === 0) return;

    setStreamingWords([]);

    const timeouts: NodeJS.Timeout[] = [];

    words.forEach((word, index) => {
      const timeout = setTimeout(() => {
        setStreamingWords((prev) => [...prev, word]);

        if (index === words.length - 1) {
          setTimeout(() => setIsComplete(true), 300);
        }
      }, index * 50);

      timeouts.push(timeout);
    });

    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [isInView, words]);

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
      {streamingWords.length > 0 && (
        <div className="mb-4 text-sm">
          {streamingWords.map((segment) => {
            if (segment.type === "paragraph-break") {
              return <div key={segment.id} className="h-4" />;
            }
            if (segment.type === "line-break") {
              return <br key={segment.id} className="animate-word-in" />;
            }
            return (
              <span key={segment.id} className="animate-word-in">
                {segment.text}
              </span>
            );
          })}
        </div>
      )}

      {isComplete && (
        <div className="flex flex-col gap-y-1 text-xs opacity-50 starting:opacity-0 transition-opacity duration-600 ease-out">
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
