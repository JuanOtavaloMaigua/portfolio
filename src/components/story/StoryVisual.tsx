import { LazyMotion } from 'motion/react';
import Machines from './visuals/Machines';
import Recipes from './visuals/Recipes';
import Pipeline from './visuals/Pipeline';
import Command from './visuals/Command';
import Tenants from './visuals/Tenants';
import type { Orientation, VisualLabels, VisualProps } from './visuals/shared';

const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default);

export type StoryVisualKey = 'machines' | 'recipes' | 'pipeline' | 'command' | 'tenants';

const VISUALS: Record<StoryVisualKey, (props: VisualProps) => React.JSX.Element> = {
  machines: Machines,
  recipes: Recipes,
  pipeline: Pipeline,
  command: Command,
  tenants: Tenants,
};

export interface StoryVisualProps {
  visual: StoryVisualKey;
  labels: VisualLabels;
  orientation?: Orientation;
  startHidden?: boolean;
}

/**
 * Island for one story diagram. The server render is the final, fully drawn state;
 * animation only starts after hydration and never with prefers-reduced-motion.
 */
export default function StoryVisual({ visual, labels, orientation = 'horizontal', startHidden = false }: StoryVisualProps) {
  const Visual = VISUALS[visual];
  return (
    <LazyMotion features={loadFeatures} strict>
      <Visual labels={labels} orientation={orientation} startHidden={startHidden} />
    </LazyMotion>
  );
}
