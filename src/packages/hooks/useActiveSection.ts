import { useEffect, useState } from "react";

/**
 * Returns the id of the section crossing the middle band of the viewport, so navigation
 * can mark where the reader is, or null when none of them does (e.g. over the hero).
 * Ids that are not in the DOM are ignored.
 */
export const useActiveSection = (ids: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const orderedIds = key.split("|");
    const elements = orderedIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    // Entries only report changes, so keep every section's last known state.
    const intersecting = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          intersecting.set(entry.target.id, entry.isIntersecting),
        );
        setActiveId(orderedIds.find((id) => intersecting.get(id)) ?? null);
      },
      // A thin band just above centre: at most one section crosses it at a time.
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
};
