interface Props {
  label: string;
  value: string | number;
  full?: boolean;
}

const InfoItem = ({ label, value, full = false }: Props) => {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 wrap-break-word">
        {value}
      </p>
    </div>
  );
};

export default InfoItem;
