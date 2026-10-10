"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "rps.best-streak.v1";
const CHANGE_EVENT = "rps:best-streak-change";

function readBestStreak(): number {
  if (typeof window === "undefined") return 0;

  try {
    const parsed = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function getServerSnapshot(): number {
  return 0;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function useBestStreak(): number {
  return useSyncExternalStore(subscribe, readBestStreak, getServerSnapshot);
}

export function recordBestStreak(value: number): boolean {
  if (value <= 0 || value <= readBestStreak()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}
