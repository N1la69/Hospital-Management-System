const HeroSection = () => {
  return (
    <section className="bg-linear-to-r from-blue-900 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            World-Class Healthcare,
            <br />
            Close to Home
          </h1>

          <p className="mt-5 text-blue-200 max-w-xl">
            Delivering trusted medical excellence with advanced technology,
            experienced doctors, and compassionate patient care for over two
            decades.
          </p>

          <p className="mt-5 text-blue-100 max-w-xl">
            Our 24/7 Helpline: <span className="font-bold">+91-XXXXXXXXXX</span>
            <br />
            Email: <span className="font-bold">info@myhospital.com</span>
          </p>
        </div>

        <div className="w-full h-64 md:h-96 rounded-xl bg-blue-200/30 flex items-center justify-center text-sm text-blue-100 border border-blue-300">
          Hero Image
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
