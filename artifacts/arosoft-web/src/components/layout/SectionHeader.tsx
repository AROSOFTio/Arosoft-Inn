interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  label?: string;
}

export function SectionHeader({ title, description, align = "center", label }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
      {label && (
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
          {label}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
