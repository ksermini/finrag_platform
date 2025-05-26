import React from "react";
import clsx from "clsx";
import "./panelbox.css"; // Make sure styles are updated (see below)

/**
 * PanelBox
 * @param {ReactNode} children
 * @param {string} title - Optional header
 * @param {'default' | 'bento' | 'glass'} variant
 * @param {boolean} gradient - Optional subtle outer frame
 * @param {boolean} compact - Less padding
 * @param {boolean} noShadow - Removes box-shadow
 * @param {string} className - Extra Tailwind or CSS classes
 */
export default function PanelBox({
  children,
  title,
  variant = "default",
  gradient = false,
  compact = false,
  noShadow = false,
  className = "",
}) {
  const classes = clsx(
    "panel-box",
    variant === "bento" && "bento-style",
    variant === "glass" && "glass-style",
    gradient && "gradient-frame",
    compact && "panel-compact",
    noShadow && "panel-no-shadow",
    className
  );

  return (
    <div className={classes}>
      {title && (
        <div className="panel-box-title">
          {title}
        </div>
      )}
      <div className="panel-box-content">{children}</div>
    </div>
  );
}
