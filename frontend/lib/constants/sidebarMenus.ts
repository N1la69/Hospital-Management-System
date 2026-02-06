import { SidebarItem } from "@/components/layout/DashboardLayout";

export const adminMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Patients", href: "/admin/patients" },
  { label: "Doctors", href: "/admin/doctors" },
  { label: "Receptionists", href: "/admin/receptionists" },
  { label: "Pharmacists", href: "/admin/pharmacists" },
  { label: "Appointments", href: "/admin/appointments" },
];

export const doctorMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/doctor" },
  { label: "My Patients", href: "/doctor/patients" },
  { label: "My Appointments", href: "/doctor/appointments" },
  { label: "Manage Schedule", href: "/doctor/availability" },
];

export const receptionistMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/receptionist" },
  { label: "Patient Utils", href: "/receptionist/patients" },
  { label: "View Doctors", href: "/receptionist/doctors" },
  { label: "Appointments", href: "/receptionist/appointments" },
  { label: "Billing", href: "/receptionist/billing" },
];

export const pharmacistMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/pharmacist" },
];
