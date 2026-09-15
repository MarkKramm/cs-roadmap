// Export and import of everything the reader owns.
//
// WHY THIS EXISTS
// Progress, portfolio, applications, the schedule, reading position, section
// ticks and two preferences live in **eight** localStorage keys. The site is
// single-user and local-first by design (D-006), which is the right call — but
// it means a cleared browser profile, a new laptop, or a reinstall destroys
// months of work on a 34–112 week curriculum, and nothing in the UI even said
// so. This module is the backup and the move.
//
// WHAT IT IS NOT
// It is not sync and not a server. There is no account, no upload, and no
// network call anywhere in this file. It reads the eight keys, emits one JSON
// document, and can read that document back.
//
// DESIGN: PURE, AND TOTAL
// Nothing here touches React, `window`, or the DOM. Storage is passed in as a
// two-method object, so the whole round trip is exercised under Node by
// `scripts/test-data.mjs` — including the rejection cases, which are the ones
// that matter. A backup format that silently accepts a malformed file and
// writes it over good data is worse than no backup at all, so **every key is
// validated before anything is written**, and a payload with one bad key is
// rejected whole rather than partially applied.
//
// See docs/DECISIONS.md → D-016.

export const FORMAT = "cs-roadmap-backup";
export const VERSION = 1;

// Every key the site owns, with the validator that decides whether an incoming
// value for it is acceptable. `kind` is documentation; the `check` function is
// the authority. Adding a ninth storage key means adding it here or it will not
// be backed up — which is the failure mode this list exists to make obvious.
export const KEYS = [
  {
    key: "cs-roadmap:progress:v1",
    kind: "map of task id -> true",
    check: isTrueMap,
  },
  {
    key: "cs-roadmap:lesson-sections:v1",
    kind: "map of 'phaseId#sectionId' -> true",
    check: isTrueMap,
  },
  {
    key: "cs-roadmap:portfolio:v1",
    kind: "array of portfolio entries",
    check: (v) => isEntryArray(v, ["id", "title"]),
  },
  {
    key: "cs-roadmap:applications:v1",
    kind: "array of application entries",
    check: (v) => isEntryArray(v, ["id", "company", "role"]),
  },
  {
    key: "cs-roadmap:schedule:v1",
    kind: "map of trackId -> YYYY-MM-DD",
    check: isDateMap,
  },
  {
    key: "cs-roadmap:reading:v1",
    kind: "{ lastTrackId, lastPhaseId, lastSection }",
    check: isReadingState,
  },
  {
    key: "cs-roadmap:energy-mode:v1",
    kind: "one of low | normal | high",
    check: (v) => ["low", "normal", "high"].includes(v),
  },
  {
    key: "cs-roadmap:reading-size:v1",
    kind: "one of s | m | l | xl",
    check: (v) => ["s", "m", "l", "xl"].includes(v),
  },
  {
    key: "cs-roadmap:notes:v1",
    kind: "map of phaseId -> { note, answers }",
    check: isNotesMap,
  },
];

const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

// --- validators -----------------------------------------------------------
// Each returns a boolean. They are deliberately strict: a backup is read back
// by a program, not a person, so "close enough" is a corruption.

function isPlainObject(v) {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

/** `{ id: true, ... }` — the shape useProgress and useLessonProgress write. */
function isTrueMap(v) {
  if (!isPlainObject(v)) return false;
  for (const [k, val] of Object.entries(v)) {
    if (typeof k !== "string" || k === "") return false;
    if (val !== true) return false;
  }
  return true;
}

/** An array where every element is an object carrying the required string fields. */
function isEntryArray(v, required) {
  if (!Array.isArray(v)) return false;
  for (const entry of v) {
    if (!isPlainObject(entry)) return false;
    for (const field of required) {
      if (typeof entry[field] !== "string" || entry[field] === "") return false;
    }
  }
  return true;
}

function isDateMap(v) {
  if (!isPlainObject(v)) return false;
  for (const val of Object.values(v)) {
    if (typeof val !== "string" || !VALID_DATE.test(val)) return false;
  }
  return true;
}

function isReadingState(v) {
  if (!isPlainObject(v)) return false;
  if (typeof v.lastTrackId !== "string") return false;
  if (typeof v.lastPhaseId !== "string") return false;
  if (!isPlainObject(v.lastSection)) return false;
  for (const [phaseId, entry] of Object.entries(v.lastSection)) {
    if (phaseId === "") return false;
    if (!isPlainObject(entry)) return false;
    if (typeof entry.id !== "string" || entry.id === "") return false;
    if (typeof entry.text !== "string") return false;
  }
  return true;
}

/**
 * `{ phaseId: { note: string, answers: { taskId: string } } }`.
 *
 * Strict on purpose, and strict in the same direction as every other validator
 * here: the reader's writing is the one thing in this store that cannot be
 * regenerated from the curriculum, so a value that does not match the shape is
 * refused rather than coerced. An absent `answers` object is tolerated because a
 * phase with only a note legitimately has none; an `answers` value that is not an
 * object is not, because that is a different shape pretending to be this one.
 */
function isNotesMap(v) {
  if (!isPlainObject(v)) return false;
  for (const [phaseId, entry] of Object.entries(v)) {
    if (typeof phaseId !== "string" || phaseId === "") return false;
    if (!isPlainObject(entry)) return false;
    if (typeof entry.note !== "string") return false;
    if (entry.answers === undefined) continue;
    if (!isPlainObject(entry.answers)) return false;
    for (const [taskId, answer] of Object.entries(entry.answers)) {
      if (typeof taskId !== "string" || taskId === "") return false;
      if (typeof answer !== "string") return false;
    }
  }
  return true;
}

// --- reading and writing --------------------------------------------------

/** Parse one stored value. Returns `{ ok, value }`; ok is false on bad JSON. */
export function readKey(storage, key) {
  let raw;
  try {
    raw = storage.getItem(key);
  } catch {
    return { ok: false, value: null, error: "storage is not readable" };
  }
  if (raw === null || raw === undefined || raw === "") {
    return { ok: true, value: null, present: false };
  }
  try {
    return { ok: true, value: JSON.parse(raw), present: true };
  } catch {
    return { ok: false, value: null, error: "stored value is not valid JSON" };
  }
}

/**
 * Build the backup document.
 *
 * Keys that are absent or unreadable are **omitted** rather than written as
 * null, so the file says what the reader actually has. A key present but
 * holding something this version cannot validate is also omitted, and reported
 * in `skipped` — exporting a corrupt value would just move the corruption.
 *
 * @returns {{ok: boolean, payload: object, skipped: Array<string>}}
 */
export function exportAll(storage, now) {
  const data = {};
  const skipped = [];
  const stamp = now || new Date().toISOString();

  for (const { key, check } of KEYS) {
    const read = readKey(storage, key);
    if (!read.ok) {
      skipped.push(key);
      continue;
    }
    if (!read.present) continue;
    if (!check(read.value)) {
      skipped.push(key);
      continue;
    }
    data[key] = read.value;
  }

  return {
    ok: true,
    skipped,
    payload: {
      format: FORMAT,
      version: VERSION,
      app: "CS Roadmap",
      exportedAt: stamp,
      data,
    },
  };
}

/**
 * Validate a parsed backup document WITHOUT applying it.
 *
 * Split from `importAll` so the UI can tell the reader what a file contains and
 * let them confirm before anything is overwritten. A destructive action should
 * be inspectable first.
 *
 * @returns {{ok: boolean, error?: string, summary?: Array, data?: object}}
 */
export function inspect(payload) {
  if (!isPlainObject(payload)) {
    return { ok: false, error: "The file is not a backup — it is not a JSON object." };
  }
  if (payload.format !== FORMAT) {
    return {
      ok: false,
      error:
        "The file is not a CS Roadmap backup (expected format “" +
        FORMAT +
        "”).",
    };
  }
  if (payload.version !== VERSION) {
    return {
      ok: false,
      error:
        "This backup is version " +
        payload.version +
        "; this site reads version " +
        VERSION +
        ". A newer backup may contain keys this version would drop, so it is refused rather than half-read.",
    };
  }
  if (!isPlainObject(payload.data)) {
    return { ok: false, error: "The backup has no data section." };
  }

  const known = new Set(KEYS.map((k) => k.key));
  const data = {};
  const summary = [];
  const rejected = [];

  for (const [key, value] of Object.entries(payload.data)) {
    const entry = KEYS.find((k) => k.key === key);
    // An unknown key is not an error: a newer version may add one, and refusing
    // the whole file over it would make forward compatibility impossible. It is
    // dropped and reported.
    if (!entry || !known.has(key)) {
      summary.push({ key, label: labelFor(key), count: null, accepted: false, reason: "unknown key" });
      continue;
    }
    if (!entry.check(value)) {
      rejected.push(key);
      summary.push({
        key,
        label: labelFor(key),
        count: null,
        accepted: false,
        reason: "failed validation",
      });
      continue;
    }
    data[key] = value;
    summary.push({ key, label: labelFor(key), count: countOf(value), accepted: true });
  }

  // One bad key fails the whole import. Half-restoring someone's progress and
  // leaving the rest silently behind is the one outcome a backup must not have.
  if (rejected.length) {
    return {
      ok: false,
      error:
        "The backup contains " +
        rejected.length +
        " key(s) that failed validation and was refused whole: " +
        rejected.join(", ") +
        ". Importing part of it would leave your data half-restored.",
      summary,
    };
  }

  if (!Object.keys(data).length) {
    return { ok: false, error: "The backup contains no recognised data.", summary };
  }

  return { ok: true, summary, data };
}

/** A human label for a key, for the confirmation list. */
export function labelFor(key) {
  const short = key.replace(/^cs-roadmap:/, "").replace(/:v\d+$/, "");
  const labels = {
    progress: "Checklist progress",
    "lesson-sections": "Lesson sections ticked",
    portfolio: "Portfolio entries",
    applications: "Applications",
    schedule: "Schedule start dates",
    reading: "Reading position",
    "energy-mode": "Energy mode",
    "reading-size": "Reading size",
    notes: "Your notes and answers",
  };
  return labels[short] || short;
}

/** How many things a value holds, for the confirmation list. */
function countOf(value) {
  if (Array.isArray(value)) return value.length;
  if (isPlainObject(value)) return Object.keys(value).length;
  return 1;
}

/**
 * Merge two values for one key.
 *
 * THE RULE: merge unions what the reader **made or finished**, and keeps this
 * machine's **preferences and position**. That line is deliberate.
 *
 * * Progress, section ticks, portfolio and applications are accomplishments and
 *   artifacts. Losing one because the other machine did not have it is the
 *   whole failure this feature exists to prevent, so they union.
 * * Reading position and the two preferences describe *this* device right now.
 *   A merge that overwrote "where I am" with a stale value from another machine
 *   would yank the reader backwards the moment they imported.
 *
 * Existing wins on an id collision, so importing the same file twice is a no-op
 * rather than a duplicate.
 */
export function mergeValue(key, current, incoming) {
  const entry = KEYS.find((k) => k.key === key);
  const kind = entry ? entry.kind : "";

  if (kind.startsWith("map of task") || kind.startsWith("map of 'phaseId")) {
    // Boolean map: union. Nothing is ever un-ticked by an import.
    return { ...current, ...incoming };
  }

  if (Array.isArray(current) && Array.isArray(incoming)) {
    const seen = new Set(current.map((e) => e && e.id));
    const extra = incoming.filter((e) => e && !seen.has(e.id));
    return [...current, ...extra];
  }

  if (isDateMap(current) && isDateMap(incoming)) {
    // One start date per track. Existing wins per track.
    return { ...incoming, ...current };
  }

  // Notes are writing, and writing unions the same way accomplishments do —
  // but at one level deeper, because each phase holds a note AND a map of task
  // answers, and those need different rules:
  //
  //   * The NOTE is prose. There is no way to merge two paragraphs a machine can
  //     honestly choose between, so the existing one wins and the incoming text
  //     is left alone. Importing must never silently replace something the
  //     reader wrote on this machine with an older draft from another one.
  //   * The ANSWERS are a map of task id -> text. A phase present on both sides
  //     unions per task, and an existing answer wins on a collision, for the
  //     same reason.
  //
  // A phase that exists only in the incoming file is taken whole — that is the
  // whole point of moving your work to a new laptop.
  if (isNotesMap(current) && isNotesMap(incoming)) {
    const merged = { ...incoming };
    for (const [phaseId, entry] of Object.entries(current)) {
      const incomingEntry = merged[phaseId];
      if (!incomingEntry) {
        merged[phaseId] = entry;
        continue;
      }
      const note = entry.note && entry.note.trim() !== "" ? entry.note : incomingEntry.note;
      merged[phaseId] = {
        note,
        answers: { ...(incomingEntry.answers || {}), ...(entry.answers || {}) },
      };
    }
    return merged;
  }

  // Preferences and reading position belong to this machine.
  return current;
}

/**
 * Apply a validated payload.
 *
 * @param {object} storage     getItem/setItem/removeItem
 * @param {object} payload     a parsed backup document
 * @param {string} mode        "merge" (default) or "replace"
 * @returns {{ok: boolean, error?: string, written: Array, summary: Array}}
 */
export function importAll(storage, payload, mode = "merge") {
  const verdict = inspect(payload);
  if (!verdict.ok) return { ok: false, error: verdict.error, written: [], summary: verdict.summary || [] };

  const written = [];

  for (const { key } of KEYS) {
    if (!(key in verdict.data)) continue;
    const incoming = verdict.data[key];

    let next = incoming;
    if (mode === "merge") {
      const current = readKey(storage, key);
      if (current.ok && current.present) {
        next = mergeValue(key, current.value, incoming);
      }
    }

    try {
      storage.setItem(key, JSON.stringify(next));
      written.push(key);
    } catch {
      return {
        ok: false,
        error:
          "Storage is full or unavailable, so the import stopped part-way. Keys already written: " +
          (written.length ? written.join(", ") : "none") +
          ".",
        written,
        summary: verdict.summary,
      };
    }
  }

  return { ok: true, written, summary: verdict.summary };
}

/**
 * A filename that sorts chronologically and says what it is.
 * Local date, because the reader is naming a file they can see, not logging an
 * event — an ISO UTC stamp would name a backup taken this evening with
 * yesterday's date anywhere west of Greenwich.
 */
export function suggestedFilename(now) {
  const d = now ? new Date(now) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    "cs-roadmap-backup-" +
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    ".json"
  );
}