import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Reading } from './ResultsTable';

interface PlotViewProps {
  readings: Reading[];
}

export const PlotView: React.FC<PlotViewProps> = ({ readings }) => {
  const responsivityRef = useRef<SVGSVGElement>(null);
  const frequencyRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (readings.length < 2) return;

    const drawPlot = (
      ref: React.RefObject<SVGSVGElement | null>, 
      xKey: keyof Reading, 
      yKey: keyof Reading, 
      xLabel: string, 
      yLabel: string,
      color: string
    ) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear()
        .domain(d3.extent(readings, d => d[xKey] as number) as [number, number])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(readings, d => d[yKey] as number) || 0])
        .range([height, 0]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      // Labels
      svg.append("text")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 35)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(xLabel);

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2 - margin.top)
        .attr("y", margin.left - 35)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(yLabel);

      const line = d3.line<Reading>()
        .x(d => x(d[xKey] as number))
        .y(d => y(d[yKey] as number))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(readings.sort((a, b) => (a[xKey] as number) - (b[xKey] as number)))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);

      g.selectAll("circle")
        .data(readings)
        .enter()
        .append("circle")
        .attr("cx", d => x(d[xKey] as number))
        .attr("cy", d => y(d[yKey] as number))
        .attr("r", 4)
        .attr("fill", color);
    };

    drawPlot(responsivityRef, 'inputVoltage', 'outputVoltage', 'Input Voltage (V)', 'Output Voltage (V)', '#3b82f6');
    drawPlot(frequencyRef, 'frequency', 'outputVoltage', 'Frequency (Hz)', 'Output Voltage (V)', '#8b5cf6');

  }, [readings]);

  if (readings.length < 2) {
    return (
      <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
        Record at least 2 readings to generate plots.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase text-center">Responsivity Curve</h3>
        <svg ref={responsivityRef} width="100%" height="300" viewBox="0 0 400 300"></svg>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase text-center">Frequency Response</h3>
        <svg ref={frequencyRef} width="100%" height="300" viewBox="0 0 400 300"></svg>
      </div>
    </div>
  );
};
