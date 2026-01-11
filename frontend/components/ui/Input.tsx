interface Props {
  label: string;
  type?: string;
  onChange: (v: any) => void;
  className?: string;
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

const Input = ({ label, type = "text", onChange, className = "" }: Props) => {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        className={inputClass}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
