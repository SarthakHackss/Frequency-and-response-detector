import React from 'react';

export interface Reading {
  id: number;
  wavelength: number;
  frequency: number;
  inputVoltage: number;
  outputVoltage: number;
  responsivity: number;
}

interface ResultsTableProps {
  readings: Reading[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ readings }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-blue-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-center">
        Experimental Readings
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">S.No</th>
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">λ (nm)</th>
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Freq (Hz)</th>
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">V_in (V)</th>
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">V_out (V)</th>
              <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">R (V/V)</th>
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic text-sm">
                  No readings recorded yet. Adjust parameters and click "Add Reading".
                </td>
              </tr>
            ) : (
              readings.map((r, idx) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-xs font-mono">{idx + 1}</td>
                  <td className="px-4 py-2 text-xs font-mono">{r.wavelength}</td>
                  <td className="px-4 py-2 text-xs font-mono">{r.frequency}</td>
                  <td className="px-4 py-2 text-xs font-mono">{r.inputVoltage.toFixed(2)}</td>
                  <td className="px-4 py-2 text-xs font-mono">{r.outputVoltage.toFixed(2)}</td>
                  <td className="px-4 py-2 text-xs font-mono font-bold text-blue-600">{r.responsivity.toFixed(3)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
