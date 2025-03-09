import React from "react";

interface TableProps {
  headers: string[];
  data: (string | number)[][];
}

const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="mt-8 bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Últimos Pedidos</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {headers.map((header, index) => (
              <th key={index} className="p-2 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
