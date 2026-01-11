interface Props {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
    </div>
  );
};

export default StatCard;
