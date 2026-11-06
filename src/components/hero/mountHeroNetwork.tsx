/**
 * Mounts the WebGL hero network over its static poster. Loaded with a dynamic import by the
 * Hero loader script, so React + three never sit on the critical path.
 */
import { createRoot } from 'react-dom/client';
import HeroNetwork from './HeroNetwork';

export function mountHeroNetwork(host: HTMLElement, coarse: boolean): void {
  const target = document.createElement('div');
  target.dataset['networkCanvas'] = '';
  host.appendChild(target);
  createRoot(target).render(
    <HeroNetwork
      host={host}
      coarse={coarse}
      onReady={() => {
        host.dataset['ready'] = '';
      }}
    />,
  );
}
