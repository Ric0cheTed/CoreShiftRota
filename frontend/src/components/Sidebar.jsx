import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-lg font-bold text-green-400">CoreShift</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/audit" className="hover:text-green-300">Audit</Link>
        <Link to="/visits" className="hover:text-green-300">Visits</Link>
        <Link to="/clients" className="hover:text-green-300">Clients</Link>
        <Link to="/employees" className="hover:text-green-300">Employees</Link>
		<Link to="/rota" className="hover:text-green-300">Rota</Link>
        <Link to="/dashboard" className="hover:text-green-300">Dashboard</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
