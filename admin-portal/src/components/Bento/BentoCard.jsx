import React from "react";
import clsx from "clsx";
import "./bentocard.css";

/**
 * BentoCard Component
 * @param {string} title - Card heading
 * @param {ReactNode} children - Main content
 * @param {string} variant - 'default' | 'blur'
 * @param {boolean} glow - Optional glowing border
 * @param {string} className - Additional styles
 */
const BentoCard = ({ title, children, variant = "default", glow = false, className = "" }) => {
  const cardClass = clsx(
    "bento-card",
    variant === "blur" && "bento-blur",
    glow && "bento-glow",
    className
  );

  return (
    <div className={cardClass}>
      <h3 className="bento-card-title">{title}</h3>
      <div className="bento-card-content">{children}</div>
    </div>
  );
};

export default BentoCard;
