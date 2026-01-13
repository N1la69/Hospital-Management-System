import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { doctorMenu } from "@/lib/constants/sidebarMenus";

const stats = {
  todayAppointments: 8,
  totalPatients: 124,
  pendingReports: 3,
  upcomingSurgeries: 2,
};

const todayAppointments = [
  { time: "10:00 AM", patient: "Rohit Sharma", type: "Consultation" },
  { time: "11:30 AM", patient: "Anita Verma", type: "Follow-up" },
  { time: "02:00 PM", patient: "Suresh Kumar", type: "New Patient" },
];

const DoctorDashboard = () => {
  return (
    <DashboardLayout title="Doctor Dashboard" menuItems={doctorMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Welcome back, Dr. John 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your activities today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
        />
        <StatCard title="Total Patients" value={stats.totalPatients} />
        <StatCard title="Pending Reports" value={stats.pendingReports} />
        <StatCard title="Upcoming Surgeries" value={stats.upcomingSurgeries} />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-slate-800">
              Today's Appointments
            </h3>
          </div>

          <div className="divide-y">
            {todayAppointments.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{a.patient}</p>
                  <p className="text-slate-500">{a.type}</p>
                </div>
                <span className="text-blue-700 font-medium">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
