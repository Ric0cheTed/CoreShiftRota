import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    api.get(`/employees/${id}`).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  const InfoRow = ({ label, value }) => (
    <p><strong>{label}:</strong> {value || "Not provided"}</p>
  );

  const tagList = employee.tags?.map(t => t.name).join(", ");
  const prefList = employee.client_preferences?.map(c => c.full_name).join(", ");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{employee.full_name}</h1>
      <div className="space-y-2">
        <InfoRow label="Status" value={employee.status} />
        <InfoRow label="Role" value={employee.role} />
        <InfoRow label="Capacity" value={employee.capacity} />
        <InfoRow label="Car Access" value={employee.car_access ? "Yes" : "No"} />
        <InfoRow label="Preferred Clients" value={prefList} />
        <InfoRow label="Tags / Skills" value={tagList} />
        <InfoRow label="Availability" value={employee.availability_summary} />
        <InfoRow label="Notes" value={employee.notes} />
      </div>
    </div>
  );
}

export default EmployeeDetail;
