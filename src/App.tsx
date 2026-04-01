import React, { useState, useCallback } from 'react';
import { Oscilloscope } from './components/Oscilloscope';
import { CircuitDiagram } from './components/CircuitDiagram';
import { ControlPanel } from './components/ControlPanel';
import { ResultsTable, Reading } from './components/ResultsTable';
import { PlotView } from './components/PlotView';
import { LabManual } from './components/LabManual';
import { Info, FlaskConical, HelpCircle, Download, FileText, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function App() {
  const [frequency, setFrequency] = useState(1000);
  const [amplitude, setAmplitude] = useState(1.0);
  const [wavelength, setWavelength] = useState(850);
  const [powerOn, setPowerOn] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showPlots, setShowPlots] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Simulation Logic
  const getResponsivity = (wl: number) => {
    if (wl === 650) return 0.45; // Red
    if (wl === 850) return 0.85; // IR (Peak)
    if (wl === 940) return 0.70; // IR
    return 0.5;
  };

  const getFrequencyGain = (f: number) => {
    const cutoff = 5000; // 5kHz cutoff
    return 1 / Math.sqrt(1 + (f / cutoff) ** 2);
  };

  const outputVoltage = amplitude * getResponsivity(wavelength) * getFrequencyGain(frequency);

  const addReading = useCallback(() => {
    if (!powerOn) return;
    const newReading: Reading = {
      id: Date.now(),
      wavelength,
      frequency,
      inputVoltage: amplitude,
      outputVoltage: outputVoltage,
      responsivity: outputVoltage / amplitude
    };
    setReadings(prev => [...prev, newReading]);
  }, [powerOn, wavelength, frequency, amplitude, outputVoltage]);

  const resetLab = () => {
    setReadings([]);
    setPowerOn(false);
    setFrequency(1000);
    setAmplitude(1.0);
    setShowPlots(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Measurement of Responsivity and Frequency Response', 105, y, { align: 'center' });
    y += 10;
    doc.text('of Optical Detector', 105, y, { align: 'center' });
    y += 20;

    // Aim
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Aim', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('To study and measure the responsivity and frequency response of an optical detector used in optical fiber communication.', margin, y, { maxWidth: 170 });
    y += 15;

    // Theory
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Theory', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const theoryText = 'Responsivity (R) is a measure of the electrical output per unit of optical input. It defines the efficiency of the conversion process in an optical detector. Frequency Response defines the speed of the detector. At higher frequencies, the response drops due to internal capacitance, acting as a low-pass filter.';
    doc.text(theoryText, margin, y, { maxWidth: 170, align: 'justify' });
    y += 25;

    // Procedure
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Procedure', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const procedures = [
      '1. Switch on the optical light source and function generator.',
      '2. Select the desired wavelength (650nm, 850nm, or 940nm).',
      '3. Vary the input amplitude and record the output voltage.',
      '4. Vary the frequency and observe the attenuation.',
      '5. Calculate responsivity using R = V_out / V_in.',
      '6. Plot the curves to analyze detector performance.'
    ];
    procedures.forEach(p => {
      doc.text(p, margin, y);
      y += 7;
    });
    y += 15;

    // Experimental Setup Diagram Placeholder
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Experimental Setup Diagram', margin, y);
    y += 10;
    doc.setDrawColor(200);
    doc.rect(margin, y, 170, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('[ Diagram: LED Source -> Optical Path -> Photodiode Detector -> Oscilloscope ]', 105, y + 22, { align: 'center' });
    y += 55;

    // Experimental Readings
    if (y > 240) {
      doc.addPage();
      y = 30;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Experimental Readings', margin, y);
    y += 8;
    
    const tableData = readings.map((r, i) => [
      i + 1,
      r.wavelength,
      r.frequency,
      r.inputVoltage.toFixed(2),
      r.outputVoltage.toFixed(2),
      r.responsivity.toFixed(3)
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Sl.No', 'Wavelength (nm)', 'Freq (Hz)', 'V_in (V)', 'V_out (V)', 'Responsivity']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
      styles: { fontSize: 10, cellPadding: 3, lineColor: [200, 200, 200] },
      margin: { left: margin, right: margin }
    });

    y = (doc as any).lastAutoTable.finalY + 20;

    // Conclusion
    if (y > 240) {
      doc.addPage();
      y = 30;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Conclusion', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const conclusionText = 'The responsivity and frequency response of the optical detector were determined experimentally. The responsivity was found to be wavelength-dependent, peaking at 850nm. The frequency response showed a characteristic low-pass behavior, with output amplitude decreasing as frequency increased beyond the cutoff point. The experiment successfully validates the theoretical concepts of detector performance.';
    doc.text(conclusionText, margin, y, { maxWidth: 170, align: 'justify' });

    y += 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Experiment Performed by: Sarthak Patil', margin, y);

    doc.save(`Lab_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900 font-sans p-4 md:p-8">
      <LabManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-800 uppercase">
              Optical Detector Lab
            </h1>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Responsivity & Frequency Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsManualOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            LAB MANUAL
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualization */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Oscilloscope Section */}
          <section className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" />
                Digital Oscilloscope
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">CH1: INPUT</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">CH2: OUTPUT</span>
              </div>
            </div>
            <Oscilloscope 
              frequency={frequency}
              amplitude={amplitude}
              powerOn={powerOn}
              channel="dual"
            />
          </section>

          {/* Circuit Section */}
          <section className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Experimental Setup</h2>
            <CircuitDiagram 
              wavelength={wavelength}
              inputVoltage={amplitude}
              detectorConnected={powerOn}
            />
          </section>
        </div>

        {/* Right Column: Controls & Data */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <ControlPanel 
            frequency={frequency}
            setFrequency={setFrequency}
            amplitude={amplitude}
            setAmplitude={setAmplitude}
            wavelength={wavelength}
            setWavelength={setWavelength}
            powerOn={powerOn}
            setPowerOn={setPowerOn}
            onAddReading={addReading}
            onReset={resetLab}
            onPlot={() => setShowPlots(true)}
          />

          <ResultsTable readings={readings} />
        </div>

        {/* Bottom Section: Plots */}
        {showPlots && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Analysis Graphs</h2>
              <button 
                onClick={() => setShowPlots(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase"
              >
                Close Plots
              </button>
            </div>
            <PlotView readings={readings} />
          </motion.div>
        )}
      </main>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-2xl w-full rounded-3xl p-8 shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight">Lab Instructions</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="font-bold text-blue-600">Aim: To study the responsivity and frequency response of an optical detector.</p>
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li><span className="font-bold">Power On:</span> Click the green "POWER ON" button to start the simulation.</li>
                  <li><span className="font-bold">Responsivity:</span> Keep frequency constant (e.g., 1000Hz). Vary the <span className="italic">Input Amplitude</span> from 1V to 10V. Observe the output voltage on the oscilloscope (Yellow line).</li>
                  <li><span className="font-bold">Frequency Response:</span> Keep Input Amplitude constant (e.g., 5V). Vary the <span className="italic">Frequency</span> from 100Hz to 10kHz. Notice how the output amplitude decreases at higher frequencies.</li>
                  <li><span className="font-bold">Data Collection:</span> Click "Add Reading" to save current parameters to the table.</li>
                  <li><span className="font-bold">Analysis:</span> Once you have several readings, click "Plot Graphs" to visualize the results.</li>
                </ol>
              </div>
              <button 
                onClick={() => setShowInstructions(false)}
                className="mt-8 w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                GOT IT, LET'S START
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span>© 2026 Virtual Lab Simulations</span>
          <span className="text-blue-500">Developed by Sarthak Patil</span>
        </div>
        <span>Optical Detector Characterization v1.0</span>
      </footer>
    </div>
  );
}
