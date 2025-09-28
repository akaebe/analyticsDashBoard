// src/components/charts/Heatmap.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const Heatmap = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.data || data.data.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate square cell size based on available space
    const maxCellWidth = chartWidth / data.dates.length;
    const maxCellHeight = Math.min(chartHeight / data.acs.length, 25);
    const cellSize = Math.min(maxCellWidth, maxCellHeight) - 2; // Leave 2px gap

    // Scales for positioning
    const xScale = d3.scaleBand()
      .domain(data.dates.map((d, i) => i))
      .range([0, data.dates.length * (cellSize + 2)])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(data.acs.map((d, i) => i))
      .range([0, Math.min(data.acs.length * (cellSize + 2), chartHeight)])
      .padding(0.1);

    // Color scale
    const maxValue = d3.max(data.data, d => d.value) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue]);

    // Create square cells with rounded corners
    const cells = g.selectAll('.cell')
      .data(data.data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 4) // Rounded corners - adjust this value for more/less rounding
      .attr('ry', 4) // Rounded corners - adjust this value for more/less rounding
      .attr('fill', d => d.value > 0 ? colorScale(d.value) : '#f8f9fa')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease');

    // Add hover effects
    cells
      .on('mouseover', function(event, d) {
        // Highlight the cell
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#374151')
          .style('filter', 'brightness(1.1)');

        // Create tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'heatmap-tooltip')
          .style('position', 'absolute')
          .style('visibility', 'visible')
          .style('background', 'rgba(17, 24, 39, 0.95)')
          .style('color', 'white')
          .style('padding', '12px 16px')
          .style('border-radius', '8px')
          .style('font-size', '12px')
          .style('font-family', 'Inter, sans-serif')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">AC ${data.acs[d.y]}</div>
            <div style="margin-bottom: 4px;">Date: ${new Date(data.dates[d.x]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div style="font-weight: 600; color: #60a5fa;">Activity: ${d.value.toLocaleString()}</div>
          `);

        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        tooltip
          .style('top', (event.pageY - tooltip.node().offsetHeight - 10) + 'px')
          .style('left', (event.pageX - tooltip.node().offsetWidth / 2) + 'px');
      })
      .on('mousemove', function(event) {
        const tooltip = d3.select('.heatmap-tooltip');
        if (!tooltip.empty()) {
          tooltip
            .style('top', (event.pageY - tooltip.node().offsetHeight - 10) + 'px')
            .style('left', (event.pageX - tooltip.node().offsetWidth / 2) + 'px');
        }
      })
      .on('mouseout', function() {
        // Reset cell styling
        d3.select(this)
          .attr('stroke-width', 1)
          .attr('stroke', '#fff')
          .style('filter', 'none');

        // Remove tooltip
        d3.selectAll('.heatmap-tooltip').remove();
      });

    // Add axes with better formatting
    const xAxis = d3.axisBottom()
      .scale(d3.scaleLinear().domain([0, data.dates.length - 1]).range([0, data.dates.length * (cellSize + 2)]))
      .tickValues(d3.range(0, data.dates.length, Math.ceil(data.dates.length / 8)))
      .tickFormat((d, i) => {
        const date = new Date(data.dates[d]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

    const yAxis = d3.axisLeft()
      .scale(d3.scaleLinear().domain([0, Math.min(data.acs.length - 1, 19)]).range([0, Math.min(data.acs.length, 20) * (cellSize + 2)]))
      .tickValues(d3.range(0, Math.min(data.acs.length, 20), 2))
      .tickFormat((d, i) => `AC ${data.acs[d]}`);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${Math.min(data.acs.length, 20) * (cellSize + 2)})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '11px')
      .style('fill', '#6b7280');

    // Add Y axis
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6b7280');

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 10;
    
    const legend = g.append('g')
      .attr('transform', `translate(${chartWidth - legendWidth}, -30)`);

    // Create gradient for legend
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * maxValue));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('rx', 2)
      .attr('ry', 2)
      .style('fill', 'url(#legend-gradient)');

    // Legend labels
    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text('0');

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text(maxValue.toLocaleString());

    return () => {
      d3.selectAll('.heatmap-tooltip').remove();
    };
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ background: 'white', borderRadius: '8px' }}
    />
  );
};
