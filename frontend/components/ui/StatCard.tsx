interface Props {
  title: string;
  value?: number;
}

const StatCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-base text-slate-700">{title}</p>
      <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
    </div>
  );
};

export default StatCard;
