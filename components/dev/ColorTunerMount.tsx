import ColorTuner from "./ColorTuner";
import { initScript } from "./color-tuner-config";

/**
 * Dev only: mounted by app/layout.tsx at the top of <body> when NODE_ENV is "development" (never in
 * a production build). The inline script applies the saved colour overrides before the page paints;
 * the tuner itself renders into a portal at the end of <body>, so it is the last tab stop and the
 * skip link stays first.
 */
export function ColorTunerMount() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
      <ColorTuner />
    </>
  );
}
