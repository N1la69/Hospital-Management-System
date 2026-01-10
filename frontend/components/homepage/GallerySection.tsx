const GallerySection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-blue-900">Our Facilities</h2>
        <p className="text-slate-600 mt-2">
          Modern infrastructure designed for comfort and safety.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-32 md:h-40 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500"
            >
              Image Placeholder
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
