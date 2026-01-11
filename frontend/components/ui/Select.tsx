interface Props {
  label: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

const Select = ({ label, options, onChange }: Props) => {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <select className={inputClass} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
