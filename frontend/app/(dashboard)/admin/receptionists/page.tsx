"use client";

import CreateReceptionistModal from "@/components/admin/CreateReceptionistModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchReceptionists } from "@/lib/api/receptionist.api";
import { ReceptionistResponse } from "@/types/receptionist";
import { useEffect, useState } from "react";

const AdminReceptionistsPage = () => {
  const [receptionists, setReceptionists] = useState<ReceptionistResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchReceptionists()
      .then(setReceptionists)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Receptionists">
      <button
        onClick={() => setOpen(true)}
        className="mb-4 bg-black text-white px-4 py-2"
      >
        + Add Receptionist
      </button>

      {loading && <p>Loading receptionists...</p>}

      {!loading && receptionists.length === 0 && <p>No receptionists found.</p>}

      {!loading && receptionists.length > 0 && (
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {receptionists.map((receptionist) => (
              <tr className="border-b" key={receptionist.id}>
                <td className="p-2">{receptionist.receptionistCode}</td>
                <td className="p-2">{receptionist.fullName}</td>
                <td className="p-2">{receptionist.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateReceptionistModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchReceptionists();
        }}
      />
    </DashboardLayout>
  );
};

export default AdminReceptionistsPage;
