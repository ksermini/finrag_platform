import React from "react";
import "./panelbox.css"; // optional external styles if needed
import clsx from "clsx";

/**
 * PanelBox
 * @param {ReactNode} children
 * @param {string} title - Optional header
 * @param {'default' | 'bento' | 'glass'} variant - Layout style
 * @param {boolean} gradient - Enables a gradient border
 * @param {string} className - Extra utility classes
 */
export default function PanelBox({
  children,
  title,
  variant = "default",
  gradient = false,
  className = "",
}) {
  const boxClass = clsx(
    "panel-box",
    variant === "bento" && "bento-style",
    variant === "glass" && "glass-style",
    gradient && "gradient-frame",
    className
  );

  return (
    <div className={boxClass}>
      {title && <div className="panel-box-title">{title}</div>}
      <div className="panel-box-content">{children}</div>
    </div>
  );
}
