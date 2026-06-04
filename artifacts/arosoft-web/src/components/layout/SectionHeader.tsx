interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  label?: string;
}

export function SectionHeader({ title, description, align = "center", label }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : "text-left"}`}>
      {label && (
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium mb-3">
          {label}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
