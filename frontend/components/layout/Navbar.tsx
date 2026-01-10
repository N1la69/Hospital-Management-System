import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
            LOGO
          </div>
          <span className="text-lg font-semibold text-blue-900">
            Hospital Name
          </span>
        </div>

        <Link
          href="/login"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
