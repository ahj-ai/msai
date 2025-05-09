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
  <div className={clsx("text-center mb-12", className)}>
    <h1
      className={clsx(
        "text-5xl md:text-6xl font-bold mb-4 text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text",
        titleClassName
      )}
    >
      {title}
    </h1>
    {subtitle && (
      <p
        className={clsx(
          "text-lg md:text-xl text-gray-300 max-w-2xl mx-auto",
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionTitle;
