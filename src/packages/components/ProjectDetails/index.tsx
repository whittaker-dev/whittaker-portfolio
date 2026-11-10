"use client";
import { IProject } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import WaveText from "../WaveText";

type Props = {
  project: IProject;
  number: string;
  isOpen: boolean;
  onClose: () => void;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Feature copy in the data starts with an emoji; the list draws its own marker instead.
const stripLeadingEmoji = (value: string) =>
  value.replace(/^[\p{Extended_Pictographic}️‍]+\s*/u, "");

/** Side drawer with the full case: links, stack, features and every screenshot. */
const ProjectDetails = ({ project, number, isOpen, onClose }: Props) => {
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
                className="fixed inset-0 z-[80] bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[920px] flex-col border-l border-line bg-paper text-ink outline-none"
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{
                  x: "100%",
                  transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
                }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-10">
                  <span className="font-display text-2xl leading-none text-brand-ink">
                    {number}
                  </span>
                  <DialogPrimitive.Close
                    aria-label={t("close")}
                    className="flex size-10 items-center justify-center border border-line transition-colors hover:border-brand-ink hover:text-brand-ink"
                  >
                    <Icon icon="ph:x-bold" className="size-5" />
                  </DialogPrimitive.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-16 pt-8 md:px-10">
                  <DialogPrimitive.Title className="display text-[clamp(2.5rem,6vw,4.5rem)]">
                    <WaveText text={project.title} withStop />
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
                    {project.description}
                  </DialogPrimitive.Description>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.demos?.map((demo) => (
                      <a
                        key={demo.url}
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-sm font-semibold text-on-brand transition-[filter] hover:brightness-125"
                      >
                        {demo.label ?? t("live_demo")}
                        <Icon
                          icon="ph:arrow-up-right-bold"
                          className="size-4"
                        />
                      </a>
                    ))}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2 border border-line-strong px-5 text-sm font-semibold transition-colors hover:border-brand-ink hover:text-brand-ink"
                      >
                        <Icon icon="ph:github-logo-bold" className="size-4" />
                        GitHub
                      </a>
                    )}
                  </div>

                  <div className="mt-12 grid gap-10 md:grid-cols-2">
                    <div>
                      <h3 className="label">{t("tech_stacks")}</h3>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {project.techStacks.map((tech) => (
                          <li
                            key={tech}
                            className="border border-line px-3 py-1.5 text-[13px] font-medium"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="label">{t("features")}</h3>
                      <ul className="mt-3">
                        {project.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 border-b border-line py-3 text-[14px]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.5em] size-1.5 shrink-0 bg-brand-ink"
                            />
                            {stripLeadingEmoji(feature)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ul className="mt-14 space-y-6">
                    {project.screenshots.map((screenshot, index) => (
                      <motion.li
                        key={screenshot}
                        className="relative aspect-[16/10] overflow-hidden border border-line bg-paper-raised"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                      >
                        <Image
                          src={screenshot}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          sizes="(min-width: 920px) 840px, 100vw"
                          className="object-cover object-top"
                        />
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default ProjectDetails;
