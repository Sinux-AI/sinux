import React from "react";

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-insane text-text-primary drop-shadow-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-secondary text-sm md:text-base font-sans mt-2 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 animate-in fade-in duration-700 delay-100">
          {action}
        </div>
      )}
    </header>
  );
}
