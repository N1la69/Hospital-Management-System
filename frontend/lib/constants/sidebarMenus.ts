import { SidebarItem } from "@/components/layout/DashboardLayout";

export const adminMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Patients", href: "/admin/patients" },
  { label: "Doctors", href: "/admin/doctors" },
  { label: "Receptionists", href: "/admin/receptionists" },
  { label: "Appointments", href: "/admin/appointments" },
];
