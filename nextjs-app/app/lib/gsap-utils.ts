import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

interface HorizontalLoopConfig {
  speed?: number;
  paused?: boolean;
  repeat?: number;
  reversed?: boolean;
  paddingRight?: string | number;
  snap?: number | boolean;
}

interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  times: number[];
}

/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
- Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
- When each item animates to the left or right enough, it will loop back to the other side
- Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
- The returned timeline will have the following methods added to it:
- next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
- previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
- toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
- current() - returns the current index (if an animation is in-progress, it reflects the final index)
- times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
*/
export function horizontalLoop(
  itemsInput: gsap.TweenTarget,
  config: HorizontalLoopConfig = {},
): HorizontalLoopTimeline {
  const items = gsap.utils.toArray(itemsInput) as Element[];
  const configOptions = { ...config };

  const tl = gsap.timeline({
    repeat: configOptions.repeat,
    paused: configOptions.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  }) as HorizontalLoopTimeline;

  const length = items.length;
  const startX = (items[0] as HTMLElement).offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (configOptions.speed || 1) * 100;
  const snap =
    configOptions.snap === false
      ? (v: number) => v
      : gsap.utils.snap(
          typeof configOptions.snap === "number" ? configOptions.snap : 1,
        );

  let totalWidth: number;
  let curX: number;
  let distanceToStart: number;
  let distanceToLoop: number;
  let item: Element;
  let i: number;
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (index: number, el: Element) => {
      const w = Number.parseFloat(
        gsap.getProperty(el, "width", "px") as string,
      );
      widths[index] = w;
      xPercents[index] = snap(
        (Number.parseFloat(gsap.getProperty(el, "x", "px") as string) / w) *
          100 +
          (gsap.getProperty(el, "xPercent") as number),
      );
      return xPercents[index];
    },
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    (items[length - 1] as HTMLElement).offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    (items[length - 1] as HTMLElement).offsetWidth *
      (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (Number.parseFloat(String(configOptions.paddingRight)) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = (item as HTMLElement).offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart +
      widths[i] * (gsap.getProperty(item, "scaleX") as number);
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(targetIndex: number, vars: gsap.TweenVars = {}) {
    const tweenVars = { ...vars };
    let adjustedIndex = targetIndex;

    if (Math.abs(adjustedIndex - curIndex) > length / 2) {
      adjustedIndex += adjustedIndex > curIndex ? -length : length;
    }

    const newIndex = gsap.utils.wrap(0, length, adjustedIndex);
    let time = times[newIndex];

    if (time > tl.time() !== adjustedIndex > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      tweenVars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (adjustedIndex > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    tweenVars.overwrite = true;
    return tl.tweenTo(time, tweenVars);
  }

  tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance

  if (configOptions.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }
  return tl;
}
