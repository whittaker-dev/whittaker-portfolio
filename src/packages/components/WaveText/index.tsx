"use client";
import { useWaveHover, WAVE_LETTER_ATTR } from "@/packages/hooks";
import React, { useRef } from "react";

const waveLetterProps = { [WAVE_LETTER_ATTR]: "" };

/** One span per letter so the wave can move each one independently. */
export const WaveLetters = ({ value }: { value: string }) => (
  <>
    {Array.from(value).map((letter, index) => (
      <span key={index} className="inline-block" {...waveLetterProps}>
        {letter}
      </span>
    ))}
  </>
);

/** The brand full stop that ends display headings, rippling with the letters before it. */
export const WaveStop = () => (
  <span className="inline-block text-brand-ink" {...waveLetterProps}>
    .
  </span>
);

type Props = {
  text: string;
  withStop?: boolean;
};

/**
 * Drop-in wave for a heading that has no reveal of its own: put it inside the heading
 * element. Words stay whole for wrapping; screen readers get the plain text.
 */
const WaveText = ({ text, withStop = false }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  useWaveHover(ref);
  const words = text.split(" ");

  return (
    <>
      <span className="sr-only">
        {text}
        {withStop && "."}
      </span>
      <span ref={ref} aria-hidden="true">
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span className="inline-block whitespace-nowrap">
              <WaveLetters value={word} />
              {withStop && index === words.length - 1 && <WaveStop />}
            </span>
            {index < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </span>
    </>
  );
};

export default WaveText;
