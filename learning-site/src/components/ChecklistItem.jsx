// One checklist item. Toggling saves immediately — no save button, no
// confirmation. See docs/DESIGN-SYSTEM.md → Interaction rules.

import { renderInline } from "../lib/renderInline.jsx";

export default function ChecklistItem({ item, checked, onToggle }) {
  return (
    <label className={"check" + (checked ? " check--done" : "")}>
      {/* The input stays a real checkbox — it carries the accessible name, the
          keyboard behaviour and the toggle semantics for free. It is drawn
          invisibly at 44px over a box we paint ourselves, because the native
          ~13px box with a UA-chosen tick was not legible on this background.
          See the "Checkboxes" block in styles/global.css for the measurements.
          The state class above drives the paint, so no `:checked` selector and
          no duplicated aria state are needed. */}
      <span className="check__box">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(item.id)}
        />
      </span>
      <span className="check__text">{renderInline(item.text, item.id)}</span>
      {item.energy && (
        <span className={"badge badge--" + item.energy}>{item.energy}</span>
      )}
    </label>
  );
}