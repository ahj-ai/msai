import React from "react";
import clsx from "clsx";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

/**
 * Uniform section title for all pages. Adjusts font size, color, and spacing.
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}) => (
  <div className={clsx("text-center mb-20", className)}>
    <h1 className={clsx("text-5xl md:text-6xl font-bold mb-6 text-gray-900", titleClassName)}>
      {title}
    </h1>
    {subtitle && (
      <p
        className={clsx(
          "text-lg md:text-xl text-white/80 max-w-2xl mx-auto",
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionTitle;
