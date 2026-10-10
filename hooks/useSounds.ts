"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SoundName = "click" | "win" | "lose" | "draw";

type Note = {
  frequency: number;
  startOffset: number;
  duration: number;
  type: OscillatorType;
  gain: number;
};

const SOUND_MAP: Record<SoundName, Note[]> = {
  click: [{ frequency: 440, startOffset: 0, duration: 0.06, type: "square", gain: 0.05 }],
  win: [
    { frequency: 523.25, startOffset: 0, duration: 0.1, type: "triangle", gain: 0.16 },
    { frequency: 659.25, startOffset: 0.09, duration: 0.1, type: "triangle", gain: 0.16 },
    { frequency: 783.99, startOffset: 0.18, duration: 0.22, type: "triangle", gain: 0.18 },
  ],
  lose: [
    { frequency: 311.13, startOffset: 0, duration: 0.14, type: "sawtooth", gain: 0.12 },
    { frequency: 207.65, startOffset: 0.12, duration: 0.28, type: "sawtooth", gain: 0.12 },
  ],
  draw: [
    { frequency: 392, startOffset: 0, duration: 0.12, type: "sine", gain: 0.12 },
    { frequency: 392, startOffset: 0.14, duration: 0.16, type: "sine", gain: 0.1 },
  ],
};

export function useSounds() {
  const contextRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const context = contextRef.current;

    if (context && context.state === "suspended") {
      void context.resume();
    }
  }, [enabled]);

  useEffect(() => {
    return () => {
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    const AudioContextCtor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) return null;

    contextRef.current ??= new AudioContextCtor();
    return contextRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;

      const context = getContext();
      if (!context) return;

      if (context.state === "suspended") {
        void context.resume();
      }

      const startedAt = context.currentTime;

      for (const note of SOUND_MAP[name]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = startedAt + note.startOffset;
        const noteEnd = noteStart + note.duration;

        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.frequency, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(note.gain, noteStart + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.02);
      }
    },
    [enabled, getContext],
  );

  const toggle = useCallback(() => {
    setEnabled((current) => !current);
  }, []);

  return { play, enabled, toggle };
}
