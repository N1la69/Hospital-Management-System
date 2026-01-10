const stats = [
  { label: "Years of Excellence", value: "20+" },
  { label: "Doctors", value: "350+" },
  { label: "Patients Treated", value: "1M+" },
  { label: "Departments", value: "40+" },
];

const TrustSection = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl border p-5">
            <div className="text-2xl font-bold text-blue-800">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;
