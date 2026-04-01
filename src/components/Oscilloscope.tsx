import React, { useEffect, useRef } from 'react';

interface OscilloscopeProps {
  frequency: number;
  amplitude: number;
  phase?: number;
  powerOn: boolean;
  channel: 1 | 2 | 'dual';
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  frequency,
  amplitude,
  phase = 0,
  powerOn,
  channel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Center Lines
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      if (powerOn) {
        const drawChannel = (amp: number, freq: number, ph: number, color: string) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          const timeScale = 0.0001; // Scale for visualization
          const visualFreq = freq * timeScale;
          
          for (let x = 0; x < canvas.width; x++) {
            const t = (x + offset) * visualFreq;
            const y = (canvas.height / 2) - (amp * 20 * Math.sin(2 * Math.PI * t + ph));
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        };

        if (channel === 1 || channel === 'dual') {
          drawChannel(amplitude, frequency, phase, '#00ff00');
        }
        if (channel === 2 || channel === 'dual') {
          // Channel 2 could be the detector output, which might be attenuated or phase shifted
          const detectorAmp = amplitude * (1 / (1 + (frequency / 5000) ** 2)); // Simple low-pass model
          drawChannel(detectorAmp, frequency, phase + 0.2, '#ffff00');
        }
        
        offset += 2; // Animation speed
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [frequency, amplitude, phase, powerOn, channel]);

  return (
    <div className="bg-black p-2 border-4 border-gray-700 rounded-lg shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="w-full h-auto bg-black"
      />
    </div>
  );
};
