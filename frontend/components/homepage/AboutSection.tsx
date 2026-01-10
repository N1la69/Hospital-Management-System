const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-blue-900">
            About Our Hospital
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Your Hospital Name is a leading multi-specialty healthcare
            institution committed to delivering ethical, safe, and
            patient-centric medical care. Our facilities are equipped with
            advanced diagnostic systems, modular operation theatres, digital
            health records, and 24/7 emergency services.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            We combine clinical excellence with cutting-edge technology to
            ensure accurate diagnosis, effective treatment, and faster recovery
            for our patients.
          </p>
        </div>

        <div className="w-full h-64 md:h-80 rounded-xl bg-slate-200 flex items-center justify-center text-sm text-slate-500">
          Hospital Building Image Placeholder
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
