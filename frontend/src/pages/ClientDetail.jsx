import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    api.get(`/clients/${id}`).then((res) => setClient(res.data));
  }, [id]);

  if (!client) return <p>Loading...</p>;

  const InfoRow = ({ label, value }) => (
    <p><strong>{label}:</strong> {value || "Not provided"}</p>
  );

  const tagList = client.tags?.map(t => t.name).join(", ");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{client.full_name}</h1>
      <div className="space-y-2">
        <InfoRow label="Phone" value={client.phone} />
        <InfoRow label="Status" value={client.status} />
        <InfoRow label="Address" value={client.address} />
        <InfoRow label="Tags" value={tagList} />
        <InfoRow label="Safeguarding" value={client.safeguarding_info} />
        <InfoRow label="Access Details" value={client.access_details} />
        <InfoRow label="Preferred Contact" value={client.contact_method} />
        <InfoRow label="Notes" value={client.notes} />
      </div>
    </div>
  );
}

export default ClientDetail;
