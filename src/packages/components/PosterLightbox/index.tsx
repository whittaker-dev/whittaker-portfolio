"use client";
import { IDesignWork } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import React from "react";
import WaveText from "../WaveText";

type Props = {
  works: IDesignWork[];
  index: number;
  isOpen: boolean;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const pad = (value: number) => String(value).padStart(2, "0");

/** Full-size view of one poster with its story, stepping through the set in place. */
const PosterLightbox = ({
  works,
  index,
  isOpen,
  onIndexChange,
  onClose,
}: Props) => {
  const work = works[index];
  const step = (delta: number) =>
    onIndexChange((index + delta + works.length) % works.length);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-black/75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className="fixed inset-x-4 top-1/2 z-[80] mx-auto grid max-h-[92svh] max-w-5xl -translate-y-1/2 grid-rows-[minmax(0,1fr)_auto] overflow-hidden border border-line-strong bg-paper outline-none md:grid-cols-[minmax(0,1fr)_320px] md:grid-rows-1"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                {/* ==== IMAGE ==== */}
                <div className="relative min-h-[46svh] bg-black md:min-h-[72svh]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={work.image}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                    >
                      <Image
                        src={work.image}
                        alt={`${work.title}, ${work.kind.toLowerCase()}`}
                        fill
                        sizes="(min-width: 768px) 680px, 100vw"
                        className="object-contain p-3 md:p-6"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ==== STORY ==== */}
                <div className="flex flex-col gap-5 border-t border-line p-5 md:border-l md:border-t-0 md:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] tracking-[0.12em] text-ink-muted tabular-nums">
                      <span className="text-brand-ink">{pad(index + 1)}</span> /{" "}
                      {pad(works.length)}
                    </p>
                    <DialogPrimitive.Close
                      aria-label={t("close")}
                      className="flex size-10 items-center justify-center border border-line transition-colors hover:border-brand-ink hover:text-brand-ink"
                    >
                      <Icon icon="ph:x-bold" className="size-5" />
                    </DialogPrimitive.Close>
                  </div>

                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={work.image}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      >
                        <DialogPrimitive.Title className="display text-[clamp(2rem,4vw,3rem)]">
                          <WaveText text={work.title} withStop />
                        </DialogPrimitive.Title>
                        <p className="label mt-3">{work.kind}</p>
                        <DialogPrimitive.Description className="mt-5 text-[15px] leading-relaxed text-ink-muted">
                          {work.description}
                        </DialogPrimitive.Description>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={t("previous_poster")}
                      className="flex size-11 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
                    >
                      <Icon icon="ph:arrow-left-bold" className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={t("next_poster")}
                      className="flex size-11 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
                    >
                      <Icon icon="ph:arrow-right-bold" className="size-4" />
                    </button>
                    <p className="label ml-2 hidden md:block">
                      {t("lightbox_hint")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default PosterLightbox;
