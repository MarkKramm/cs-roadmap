// The keyboard shortcut list, and the button that opens it.
//
// A shortcut nobody knows about is not a feature, so the list is discoverable
// from two places: the `?` key, and a visible control in the topbar. The control
// is always rendered rather than revealed on hover, because a touch user has no
// hover — the same rule the code-block copy button follows.

import { useEffect, useRef } from "react";
import { SHORTCUTS } from "../hooks/useShortcuts.js";

export default function ShortcutHelp({ open, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const lastFocus = useRef(null);

  // Move focus into the panel while it is open and restore it on close, so a
  // keyboard user who opened it with `?` can dismiss it with Escape and carry on
  // from where they were rather than from the top of the document.
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    return () => {
      const el = lastFocus.current;
      if (el && typeof el.focus === "function") el.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="shortcuts-backdrop" role="presentation" onClick={onClose}>
      <div
        className="shortcuts"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shortcuts__head">
          <h2 id="shortcuts-title">Keyboard shortcuts</h2>
          <button
            type="button"
            className="shortcuts__close"
            aria-label="Close keyboard shortcuts"
            ref={closeRef}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <ul className="shortcuts__list">
          {SHORTCUTS.map((s) => (
            <li key={s.keys} className="shortcuts__row">
              <kbd className="kbd">{s.keys}</kbd>
              <span className="shortcuts__label">{s.label}</span>
            </li>
          ))}
        </ul>

        <p className="muted shortcuts__note">
          Shortcuts are ignored while you are typing in a field.
        </p>
      </div>
    </div>
  );
}