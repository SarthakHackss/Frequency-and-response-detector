import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Target, Wrench, ListChecks, FileText } from 'lucide-react';

interface LabManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabManual: React.FC<LabManualProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Lab Manual</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Aim Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Target className="w-5 h-5" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Aim</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-blue-100 pl-4">
                  To study and measure the responsivity and frequency response of an optical detector (Photodiode) used in optical fiber communication.
                </p>
              </section>

              {/* Theory Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Theory</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
                  <p>
                    <strong>Responsivity (R)</strong> is a measure of the electrical output per unit of optical input. It defines the efficiency of the conversion process in an optical detector.
                  </p>
                  <p>
                    <strong>Frequency Response</strong> defines the speed of the detector. At higher frequencies, the response drops due to internal capacitance, acting as a low-pass filter.
                  </p>
                </div>
              </section>

              {/* Apparatus Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Wrench className="w-5 h-5" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Apparatus</h3>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {['Optical Emitter (LED)', 'Photodiode Detector', 'Function Generator', 'Digital Oscilloscope'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Procedure Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <ListChecks className="w-5 h-5" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Procedure</h3>
                </div>
                <div className="space-y-4">
                  {[
                    'Switch on the optical light source and function generator.',
                    'Select the desired wavelength (650nm, 850nm, or 940nm).',
                    'Vary the input amplitude and record the output voltage.',
                    'Vary the frequency and observe the attenuation.',
                    'Calculate responsivity using R = V_out / V_in.',
                    'Plot the curves to analyze detector performance.'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-600 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                CLOSE MANUAL
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
