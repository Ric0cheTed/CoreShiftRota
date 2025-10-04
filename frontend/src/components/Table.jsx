const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left border-b">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center">No data</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 border-b">{row[col.toLowerCase()]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
