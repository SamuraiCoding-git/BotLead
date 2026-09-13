import { useEffect, useState, type ReactNode } from "react";
import styles from "./Accordion.module.css";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  items: AccordionItem[];
  /**
   * When this id changes to a non-null value, that section is opened
   * (in addition to whatever the user already had open) and scrolled
   * into view. Used by the result screen's "Узнать подробнее" control.
   */
  forceOpenId?: string | null;
};

export default function Accordion({ items, forceOpenId }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!forceOpenId) return;
    setOpenIds((prev) => new Set(prev).add(forceOpenId));
    const el = document.getElementById(`accordion-${forceOpenId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceOpenId]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div className={styles.item} key={item.id} id={`accordion-${item.id}`}>
            <button
              className={styles.trigger}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
            >
              <span>{item.title}</span>
              <svg
                className={styles.chevron}
                data-open={isOpen}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={styles.panel} data-open={isOpen} id={`accordion-panel-${item.id}`}>
              <div className={styles.panelInner}>
                <div className={styles.panelContent}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
