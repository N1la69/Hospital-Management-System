const Footer = () => {
  return (
    <footer className="bg-blue-900 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-semibold text-white">Hospital Name</div>
          <p className="mt-2 text-blue-200">
            Trusted multi-specialty healthcare provider delivering excellence in
            clinical outcomes and patient experience.
          </p>
        </div>

        <div>
          <div className="font-semibold text-white">Contact</div>
          <p className="mt-2 text-blue-200">24/7 Helpline: +91-XXXXXXXXXX</p>
          <p className="text-blue-200">Email: info@myhospital.com</p>
        </div>

        <div className="md:text-right">
          <p className="text-blue-200">
            © {new Date().getFullYear()} Hospital Name
          </p>
          <p className="text-blue-300">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
