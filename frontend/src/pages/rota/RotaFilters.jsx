
import React from "react";

const RotaFilters = ({
  visits = [],
  selectedDate,
  setSelectedDate,
  selectedClient,
  setSelectedClient,
  selectedEmployee,
  setSelectedEmployee,
  clients = [],
  employees = []
}) => {
  if (!visits || visits.length === 0) return null;

  const uniqueDates = [...new Set(visits.map((v) => v.date).filter(Boolean))];

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <select
        className="border p-2 rounded"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        <option value="">All Dates</option>
        {uniqueDates.map((date) => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <option value="">All Clients</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name || `Client #${client.id}`}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="">All Carers</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name || `Carer #${emp.id}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RotaFilters;
