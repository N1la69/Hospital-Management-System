const services = [
  "Cardiology & Cardiac Surgery",
  "Neurology & Neurosurgery",
  "Orthopaedics & Joint Replacement",
  "Oncology & Cancer Care",
  "Mother & Child Care",
  "Emergency & Trauma Services",
  "Diagnostics & Imaging",
  "Pharmacy & Rehabilitation",
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          Our Medical Services
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Comprehensive multi-specialty care supported by modern infrastructure,
          evidence-based medicine, and trained doctors.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white border p-4 text-sm text-slate-700 hover:shadow-md transition"
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
