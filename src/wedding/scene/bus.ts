// Tiny event bus so DOM sections (e.g. the RSVP form) can trigger
// effects inside the 3D background scene.

type BurstListener = (x?: number, y?: number) => void;

const burstListeners = new Set<BurstListener>();

export const bus = {
  onBurst(listener: BurstListener) {
    burstListeners.add(listener);
    return () => {
      burstListeners.delete(listener);
    };
  },
  burst(x = 0, y = 0) {
    burstListeners.forEach((fn) => fn(x, y));
  },
};
