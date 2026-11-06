import { useEffect, useState } from 'react';
import StoryVisual, { type StoryVisualKey } from './StoryVisual';
import type { VisualLabels } from './visuals/shared';

interface Props {
  /** Visual keys in block order; the first one is the server-rendered state. */
  visuals: StoryVisualKey[];
  labels: VisualLabels;
}

/**
 * Desktop sticky panel: shows the visual of the story block currently in the middle
 * of the viewport. Blocks are static HTML marked with data-story-block / data-visual.
 */
export default function StoryVisualPanel({ visuals, labels }: Props) {
  const first = visuals[0] ?? 'machines';
  const [active, setActive] = useState<StoryVisualKey>(first);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const blocks = document.querySelectorAll<HTMLElement>('[data-story-block]');
    if (blocks.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = entry.target.getAttribute('data-visual');
          if (entry.isIntersecting && visuals.includes(key as StoryVisualKey)) setActive(key as StoryVisualKey);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [visuals]);

  // Remount on change so the new visual plays from the start (already hydrated: start hidden).
  return <StoryVisual key={active} visual={active} labels={labels} startHidden={hydrated} />;
}
