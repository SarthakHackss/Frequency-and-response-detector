import React from 'react';
import { Play, RotateCcw, Plus, Printer, TrendingUp } from 'lucide-react';

interface ControlPanelProps {
  frequency: number;
  setFrequency: (f: number) => void;
  amplitude: number;
  setAmplitude: (a: number) => void;
  wavelength: number;
  setWavelength: (w: number) => void;
  powerOn: boolean;
  setPowerOn: (p: boolean) => void;
  onAddReading: () => void;
  onReset: () => void;
  onPlot: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  frequency,
  setFrequency,
  amplitude,
  setAmplitude,
  wavelength,
  setWavelength,
  powerOn,
  setPowerOn,
  onAddReading,
  onReset,
  onPlot
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Frequency Control */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Frequency (Hz)</label>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between items-center">
            <span className="text-lg font-mono font-bold text-blue-700">{frequency}</span>
            <span className="text-[10px] text-gray-400">100Hz - 10kHz</span>
          </div>
        </div>

        {/* Amplitude Control */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Input Amplitude (V)</label>
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between items-center">
            <span className="text-lg font-mono font-bold text-blue-700">{amplitude.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">0.1V - 10V</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Wavelength</label>
          <select 
            value={wavelength}
            onChange={(e) => setWavelength(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm font-mono"
          >
            <option value={650}>650 nm (Red)</option>
            <option value={850}>850 nm (IR)</option>
            <option value={940}>940 nm (IR)</option>
          </select>
        </div>
        
        <button 
          onClick={() => setPowerOn(!powerOn)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all ${
            powerOn 
              ? 'bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
          }`}
        >
          <Play className={`w-4 h-4 ${powerOn ? 'fill-current' : ''}`} />
          {powerOn ? 'POWER OFF' : 'POWER ON'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={onAddReading}
          className="flex flex-col items-center justify-center gap-1 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Add Reading</span>
        </button>
        <button 
          onClick={onPlot}
          className="flex flex-col items-center justify-center gap-1 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200 transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Plot Graphs</span>
        </button>
        <button 
          onClick={onReset}
          className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 border border-gray-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Reset Lab</span>
        </button>
      </div>
    </div>
  );
};
