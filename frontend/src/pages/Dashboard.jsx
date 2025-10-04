import React from "react";
import { Link } from "react-router-dom";
import RotaExportButton from "../components/RotaExportButton";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold text-gray-800">Rota Overview</h2>
          <p className="text-sm text-gray-500">Manage visits by day and employee.</p>
          <Link to="/rota" className="text-sm text-green-700 underline mt-2 inline-block">
            View Rota
          </Link>
        </div>
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold text-gray-800">Client Management</h2>
          <p className="text-sm text-gray-500">View and manage client records.</p>
          <Link to="/clients" className="text-sm text-green-700 underline mt-2 inline-block">
            View Clients
          </Link>
        </div>
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold text-gray-800">Employee Management</h2>
          <p className="text-sm text-gray-500">View and manage carer assignments.</p>
          <Link to="/employees" className="text-sm text-green-700 underline mt-2 inline-block">
            View Employees
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <RotaExportButton />
      </div>
    </div>
  );
};

export default Dashboard;
