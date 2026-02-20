import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import { getServiceRequests } from '../../services/headAdminService';

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getServiceRequests();
      const found = res.data.find((r) => r._id === id);
      setRequest(found);
    };
    load();
  }, [id]);

  if (!request) return <div>Loading...</div>;

  return (
    <HeadAdminNavbar>
      <div style={{ padding: 40 }}>
        <h2>Service Request Details</h2>

        <p><strong>User:</strong> {request.user_name}</p>
        <p><strong>Device:</strong> {request.device_id}</p>
        <p><strong>Service Type:</strong> {request.service_type || request.request_type}</p>
        <p><strong>Status:</strong> {request.status}</p>

        <p><strong>Scheduled At:</strong> {request.scheduled_at ? new Date(request.scheduled_at).toLocaleString() : '—'}</p>
        <p><strong>Arrived At:</strong> {request.arrived_at ? new Date(request.arrived_at).toLocaleString() : '—'}</p>
        <p><strong>Completed At:</strong> {request.completed_at ? new Date(request.completed_at).toLocaleString() : '—'}</p>

        <p><strong>Replaced Parts:</strong> {request.replaced_parts?.join(', ')}</p>

        <p><strong>Severity:</strong> {request.observations?.severity}</p>
        <p><strong>Notes:</strong> {request.observations?.notes}</p>

        <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
      </div>
    </HeadAdminNavbar>
  );
}