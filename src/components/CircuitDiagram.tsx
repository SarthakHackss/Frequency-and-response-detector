import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Lightbulb, Cable } from 'lucide-react';

interface CircuitDiagramProps {
  wavelength: number;
  inputVoltage: number;
  detectorConnected: boolean;
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  wavelength,
  inputVoltage,
  detectorConnected
}) => {
  return (
    <div className="relative w-full h-64 bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-around overflow-hidden">
      {/* Light Source */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-800 shadow-md relative">
          <Lightbulb className="w-12 h-12 text-yellow-500" />
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-1 rounded">Emitter</div>
        </div>
        <span className="text-xs font-mono font-bold">LED ({wavelength}nm)</span>
      </div>

      {/* Optical Path */}
      <div className="flex-1 h-1 bg-gray-200 relative mx-4">
        <motion.div 
          className="absolute inset-0 bg-red-400 opacity-50"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ height: '4px', top: '-1.5px' }}
        />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-widest">Optical Path</div>
      </div>

      {/* Detector */}
      <div className="flex flex-col items-center gap-2">
        <motion.div 
          className={`p-4 rounded-lg border-2 shadow-md relative ${detectorConnected ? 'bg-green-50 border-green-800' : 'bg-gray-100 border-gray-800'}`}
          whileHover={{ scale: 1.05 }}
        >
          <Activity className={`w-12 h-12 ${detectorConnected ? 'text-green-600' : 'text-gray-400'}`} />
          <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] px-1 rounded">Detector</div>
        </motion.div>
        <span className="text-xs font-mono font-bold">Photodiode</span>
      </div>

      {/* Connection Line to Oscilloscope */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-gray-500">
        <Cable className="w-4 h-4" />
        <span className="text-[10px] uppercase font-bold">To Oscilloscope</span>
      </div>

      <div className="absolute top-2 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
        Circuit Simulation: Responsivity Measurement
      </div>
    </div>
  );
};
