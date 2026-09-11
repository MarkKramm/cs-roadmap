// Progress state, persisted in localStorage.
//
// Keys are the stable task IDs emitted by the content pipeline (for example
// "it-03-c01"), never the task text — so editing a checklist item's wording
// does not lose progress. See docs/CONTENT-SCHEMA.md.

import { useState, useEffect, useCallback } from "react";

const KEY = "cs-roadmap:progress:v1";

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [done, setDone] = useState(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(done));
    } catch {
      // Storage unavailable or full. Progress works for the session but will
      // not persist. Not fatal, so we do not surface an error to the user.
    }
  }, [done]);

  const toggle = useCallback((id) => {
    setDone((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const reset = useCallback(() => setDone({}), []);

  return { done, toggle, reset };
}

export function countDone(done, items) {
  let n = 0;
  for (const item of items) if (done[item.id]) n++;
  return n;
}