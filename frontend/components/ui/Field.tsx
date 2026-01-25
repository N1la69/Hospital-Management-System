interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field = ({
  label,
  required = false,
  hint,
  children,
  className = "",
}: FieldProps) => {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
        {hint && (
          <p className="text-[11px] text-slate-500 leading-snug">{hint}</p>
        )}
      </label>

      {children}
    </div>
  );
};

export default Field;
