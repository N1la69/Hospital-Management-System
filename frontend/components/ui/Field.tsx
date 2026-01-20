const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
};

export default Field;
