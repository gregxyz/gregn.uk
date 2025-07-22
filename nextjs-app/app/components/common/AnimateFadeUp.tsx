"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface AnimateFadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  trigger?: "viewport" | "immediate";
  className?: string;
  once?: boolean;
  start?: string;
  end?: string;
}

export function AnimateFadeUp({
  children,
  delay = 0,
  duration = 1.2,
  distance = 10,
  trigger = "viewport",
  className = "",
  once = true,
  start = "top 90%",
  end = "top 20%",
}: AnimateFadeUpProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const animationConfig = {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "expo.out",
      ...(trigger === "viewport" && {
        scrollTrigger: {
          trigger: element,
          start: start,
          end: end,
          once,
        },
      }),
    };

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: distance,
      },
      animationConfig,
    );
  });

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
