"use client";
import ProjectDetails from "@/packages/components/ProjectDetails";
import ProjectList from "@/packages/components/ProjectList";
import ProjectRing from "@/packages/components/ProjectRing";
import SectionHeading from "@/packages/components/SectionHeading";
import ViewSwitch, { ViewOption } from "@/packages/components/ViewSwitch";
import { projects } from "@/packages/database";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type ProjectView = "carousel" | "list";

const VIEW_STORAGE_KEY = "project-view";
const VIEWS: ViewOption<ProjectView>[] = [
  { id: "carousel", icon: "ph:circles-three-bold", label: "view_carousel" },
  { id: "list", icon: "ph:list-bold", label: "view_list" },
];

// Remembered per visitor as a convenience; anything unreadable falls back to the carousel.
const readStoredView = (): ProjectView => {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === "list"
      ? "list"
      : "carousel";
  } catch {
    return "carousel";
  }
};

const Projects = () => {
  const [view, setView] = useState<ProjectView>(readStoredView);
  // The drawer keeps showing the last project while it animates closed.
  const [openIndex, setOpenIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const changeView = (next: ProjectView) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // Not remembered, still switched.
    }
  };

  const openProject = (index: number) => {
    setOpenIndex(index);
    setIsOpen(true);
  };

  return (
    <section id="projects" className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          title={t("feature_projects")}
          description={t("projects_desc")}
          aside={
            <ViewSwitch
              id="project-view"
              label={t("view_mode")}
              value={view}
              options={VIEWS.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
              onChange={changeView}
            />
          }
        />

        <div className="mt-14 md:mt-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "carousel" ? (
                <ProjectRing projects={projects} onOpen={openProject} />
              ) : (
                <ProjectList projects={projects} onOpen={openProject} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ProjectDetails
        project={projects[openIndex]}
        number={String(openIndex + 1).padStart(2, "0")}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </section>
  );
};

export default Projects;
