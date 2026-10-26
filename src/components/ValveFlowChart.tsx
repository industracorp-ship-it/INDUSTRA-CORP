import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Sliders, 
  HelpCircle, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight,
  Droplet,
  Layers,
  Gauge,
  Sparkles,
  Zap
} from 'lucide-react';
import { ValveDimensionSpec, SupportedLanguage } from '../types/valve';

interface ValveFlowChartProps {
  specs: ValveDimensionSpec[];
  valveName: string;
  valveCode: string;
  lang: SupportedLanguage;
}

export const ValveFlowChart: React.FC<ValveFlowChartProps> = ({
  specs,
  valveName,
  valveCode,
  lang,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Main visual mode: 'dp_vs_q' (Pressure Drop vs Flow Rate) OR 'kv_distribution' (Kv by DN)
  const [activeMode, setActiveMode] = useState<'dp_vs_q' | 'kv_distribution'>('dp_vs_q');

  // Display options
  const [chartType, setChartType] = useState<'curve' | 'bar' | 'both'>('curve');
  const [flowUnit, setFlowUnit] = useState<'kv' | 'cv'>('kv'); // kv: m3/h, cv: US GPM
  const [fluidType, setFluidType] = useState<'water' | 'chilled_water' | 'hot_water' | 'steam' | 'oil'>('water');

  // Sizing target parameters
  const [targetFlowQ, setTargetFlowQ] = useState<number>(120); // m3/h
  const [pressureDropDeltaP, setPressureDropDeltaP] = useState<number>(0.25); // bar (target allowable delta P)
  const [selectedDnHighlight, setSelectedDnHighlight] = useState<string | null>(null);

  // Hover state for interactive tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{
    dn: string;
    flowQ: number;
    deltaP: number;
    velocity: number;
    kv: number;
    x: number;
    y: number;
  } | null>(null);

  // Specific gravity (SG) for fluids
  const fluidDensity = useMemo(() => {
    switch (fluidType) {
      case 'chilled_water': return 1.02; // Glycol mix / chilled water
      case 'hot_water': return 0.96;     // 90°C - 120°C hot water
      case 'oil': return 0.88;           // Mineral oil / diesel
      case 'steam': return 0.05;         // Steam vapor equivalent factor
      case 'water':
      default: return 1.0;               // 20°C standard clean water
    }
  }, [fluidType]);

  // Clean data sorted by size/index
  const chartData = useMemo(() => {
    return specs
      .filter((s) => s.kvFlow && s.kvFlow > 0)
      .map((s, idx) => {
        const dnNumeric = parseInt(s.dn.replace(/[^0-9]/g, '')) || 50;
        return {
          index: idx,
          dn: s.dn,
          dnNumeric,
          kv: s.kvFlow,
          cv: s.cvFlow || Math.round(s.kvFlow * 1.156),
          pn: s.pn,
          weight: s.weightKg,
          faceToFace: s.faceToFace,
        };
      });
  }, [specs]);

  // Calculate required Kv based on formula: Kv_req = Q / sqrt(deltaP / SG)
  const requiredKv = useMemo(() => {
    if (pressureDropDeltaP <= 0 || targetFlowQ <= 0) return 0;
    return Number((targetFlowQ / Math.sqrt(pressureDropDeltaP / fluidDensity)).toFixed(1));
  }, [targetFlowQ, pressureDropDeltaP, fluidDensity]);

  const requiredCv = useMemo(() => {
    return Number((requiredKv * 1.156).toFixed(1));
  }, [requiredKv]);

  // Evaluate each DN for the current operating point: actual DeltaP and fluid velocity
  const sizingEvaluation = useMemo(() => {
    return chartData.map((d) => {
      // actual Delta P = (Q / Kv)^2 * SG (bar)
      const actualDp = Math.pow(targetFlowQ / d.kv, 2) * fluidDensity;
      // Fluid velocity v = (4 * Q) / (pi * D^2 * 3600)  [m/s]
      const diameterM = d.dnNumeric / 1000;
      const areaM2 = (Math.PI * Math.pow(diameterM, 2)) / 4;
      const velocityMs = (targetFlowQ / 3600) / areaM2;

      let status: 'optimal' | 'acceptable' | 'too_small' | 'oversized' = 'acceptable';
      let verdictVi = 'Chấp nhận được';
      let verdictEn = 'Acceptable';

      if (actualDp >= 0.08 && actualDp <= 0.40 && velocityMs >= 1.0 && velocityMs <= 3.0) {
        status = 'optimal';
        verdictVi = 'Kích thước tối ưu khuyên dùng (Độ giảm áp & vận tốc kinh tế)';
        verdictEn = 'Optimal size recommended (Economical ΔP & velocity)';
      } else if (actualDp > 0.60 || velocityMs > 3.8) {
        status = 'too_small';
        verdictVi = 'Quá nhỏ (Tổn thất áp cao, nguy cơ ồn & xâm thực cavitation)';
        verdictEn = 'Undersized (High pressure drop, noise & cavitation risk)';
      } else if (actualDp < 0.04 && velocityMs < 0.8) {
        status = 'oversized';
        verdictVi = 'Quá lớn (Thừa cỡ van, lãng phí chi phí đầu tư ban đầu)';
        verdictEn = 'Oversized (Higher procurement cost, sluggish control)';
      }

      return {
        ...d,
        actualDp: Number(actualDp.toFixed(3)),
        velocityMs: Number(velocityMs.toFixed(2)),
        status,
        verdictVi,
        verdictEn,
      };
    });
  }, [chartData, targetFlowQ, fluidDensity]);

  // Identify recommended DN
  const recommendedSpec = useMemo(() => {
    if (chartData.length === 0) return null;
    const optimal = sizingEvaluation.find((s) => s.status === 'optimal');
    if (optimal) return optimal;
    // Fallback: smallest DN with actualDp <= pressureDropDeltaP * 1.2
    const reasonable = sizingEvaluation.find((s) => s.actualDp <= pressureDropDeltaP * 1.2);
    return reasonable || sizingEvaluation[sizingEvaluation.length - 1];
  }, [sizingEvaluation, chartData, pressureDropDeltaP]);

  // Color palette for multiple DN curves in D3
  const curveColors = [
    '#f59e0b', // Amber (DN50)
    '#38bdf8', // Sky Blue
    '#10b981', // Emerald
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f97316', // Orange
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#6366f1', // Indigo
    '#14b8a6', // Teal
  ];

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 310;
    const margin = { top: 30, right: 90, bottom: 48, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Definitions
    const defs = svg.append('defs');

    // Glow Filter
    const filter = defs.append('filter').attr('id', 'd3-glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    if (activeMode === 'dp_vs_q') {
      // =========================================================================
      // MODE 1: PRESSURE DROP VS FLOW RATE (ΔP vs Q CURVES)
      // =========================================================================
      
      // Select subset of sizes to keep chart readable (max 7 sizes)
      const visibleCurves = chartData.length > 7
        ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0 || i === chartData.length - 1)
        : chartData;

      // X Scale: Flow Rate Q (m3/h)
      const maxQ = Math.max(targetFlowQ * 1.8, d3.max(visibleCurves, (d) => d.kv * 1.1) || 300);
      const xScale = d3.scaleLinear()
        .domain([0, maxQ])
        .range([0, innerWidth])
        .nice();

      // Y Scale: Pressure Drop ΔP (bar)
      const maxDp = 1.0; // 0 to 1.0 bar (typical engineering range)
      const yScale = d3.scaleLinear()
        .domain([0, maxDp])
        .range([innerHeight, 0]);

      // Horizontal Grid Lines
      const yAxisGrid = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '');

      g.append('g')
        .attr('class', 'grid-lines')
        .call(yAxisGrid)
        .selectAll('line')
        .attr('stroke', '#334155')
        .attr('stroke-dasharray', '3,3')
        .attr('stroke-opacity', 0.5);

      g.selectAll('.grid-lines .domain').remove();

      // Recommended Working Zone (Green shaded rectangle for ΔP 0.1 - 0.4 bar)
      const yZoneTop = yScale(0.40);
      const yZoneBottom = yScale(0.10);
      g.append('rect')
        .attr('x', 0)
        .attr('y', yZoneTop)
        .attr('width', innerWidth)
        .attr('height', yZoneBottom - yZoneTop)
        .attr('fill', '#10b981')
        .attr('fill-opacity', 0.08)
        .attr('stroke', '#10b981')
        .attr('stroke-dasharray', '4,4')
        .attr('stroke-opacity', 0.3);

      g.append('text')
        .attr('x', innerWidth - 8)
        .attr('y', yZoneTop + 14)
        .attr('text-anchor', 'end')
        .attr('fill', '#34d399')
        .attr('font-size', '9px')
        .attr('font-mono', 'true')
        .attr('font-weight', 'bold')
        .text('Dải ΔP Kinh Tế Chuẩn (0.1 - 0.4 bar)');

      // Generate Curve Paths for each DN
      // Formula: ΔP = (Q / Kv)^2 * SG  => Q = Kv * sqrt(ΔP / SG)
      visibleCurves.forEach((item, curveIdx) => {
        const color = curveColors[curveIdx % curveColors.length];
        const isRec = recommendedSpec?.dn === item.dn;
        const isSelected = selectedDnHighlight === item.dn;

        // Generate sample points from Q = 0 to max allowable flow
        const curvePoints: [number, number][] = [];
        const numSteps = 40;
        for (let i = 0; i <= numSteps; i++) {
          const qVal = (i / numSteps) * maxQ;
          const dpVal = Math.pow(qVal / item.kv, 2) * fluidDensity;
          if (dpVal <= maxDp * 1.15) {
            curvePoints.push([qVal, dpVal]);
          }
        }

        const lineGenerator = d3.line<[number, number]>()
          .x((p) => xScale(p[0]))
          .y((p) => yScale(p[1]))
          .curve(d3.curveMonotoneX);

        // Path
        const path = g.append('path')
          .datum(curvePoints)
          .attr('class', `curve-dn-${item.dnNumeric}`)
          .attr('fill', 'none')
          .attr('stroke', isRec ? '#10b981' : color)
          .attr('stroke-width', isRec || isSelected ? 3.2 : 1.8)
          .attr('stroke-opacity', isSelected || !selectedDnHighlight ? (isRec ? 1 : 0.85) : 0.25)
          .attr('filter', isRec ? 'url(#d3-glow)' : 'none')
          .attr('d', lineGenerator);

        // Animate path draw
        const length = (path.node() as SVGPathElement)?.getTotalLength() || 0;
        path
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(700)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);

        // Label at end of curve
        if (curvePoints.length > 0) {
          const lastPt = curvePoints[curvePoints.length - 1];
          const labelY = Math.max(12, Math.min(innerHeight - 4, yScale(lastPt[1])));

          const labelG = g.append('g')
            .attr('transform', `translate(${xScale(lastPt[0]) + 6}, ${labelY})`)
            .attr('class', 'cursor-pointer')
            .on('click', () => {
              setSelectedDnHighlight(selectedDnHighlight === item.dn ? null : item.dn);
            });

          labelG.append('rect')
            .attr('x', 0)
            .attr('y', -9)
            .attr('width', 58)
            .attr('height', 16)
            .attr('rx', 3)
            .attr('fill', isRec ? '#064e3b' : '#0f172a')
            .attr('stroke', isRec ? '#10b981' : color)
            .attr('stroke-width', 1);

          labelG.append('text')
            .attr('x', 29)
            .attr('y', 3)
            .attr('text-anchor', 'middle')
            .attr('fill', isRec ? '#34d399' : '#f8fafc')
            .attr('font-size', '9px')
            .attr('font-family', 'monospace')
            .attr('font-weight', isRec ? 'bold' : 'normal')
            .text(`${item.dn}`);
        }
      });

      // Target Operating Point Indicator (Crosshair lines at targetFlowQ and pressureDropDeltaP)
      const targetX = xScale(targetFlowQ);
      const targetY = yScale(pressureDropDeltaP);

      // Vertical Target Flow Line
      g.append('line')
        .attr('x1', targetX)
        .attr('x2', targetX)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '4,3')
        .attr('opacity', 0.85);

      // Horizontal Target ΔP Line
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', targetY)
        .attr('y2', targetY)
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '4,3')
        .attr('opacity', 0.85);

      // Operating Point Center Dot
      g.append('circle')
        .attr('cx', targetX)
        .attr('cy', targetY)
        .attr('r', 6)
        .attr('fill', '#f59e0b')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('filter', 'url(#d3-glow)')
        .attr('class', 'animate-pulse');

      // Tag on Operating Point
      g.append('rect')
        .attr('x', Math.min(targetX + 8, innerWidth - 95))
        .attr('y', Math.max(10, targetY - 24))
        .attr('width', 90)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', '#78350f')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1);

      g.append('text')
        .attr('x', Math.min(targetX + 8, innerWidth - 95) + 45)
        .attr('y', Math.max(10, targetY - 24) + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fef3c7')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(`Q=${targetFlowQ} | ΔP=${pressureDropDeltaP}`);

      // X Axis
      const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat((d) => `${d}`);
      const xAxisG = g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);
      xAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '10px');
      xAxisG.select('.domain').attr('stroke', '#475569');

      // X Axis Label
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 36)
        .attr('text-anchor', 'middle')
        .attr('fill', '#cbd5e1')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(lang === 'vi' ? 'Lưu lượng dòng chảy Q (m³/h)' : 'Flow Rate Q (m³/h)');

      // Y Axis
      const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d} bar`);
      const yAxisG = g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
      yAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '10px');
      yAxisG.select('.domain').attr('stroke', '#475569');

      // Y Axis Label
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#cbd5e1')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(lang === 'vi' ? 'Độ giảm áp ΔP (bar)' : 'Pressure Drop ΔP (bar)');

    } else {
      // =========================================================================
      // MODE 2: KV / CV DISTRIBUTION BY DN SIZE (BAR / CURVE)
      // =========================================================================

      const xLabels = chartData.map((d) => d.dn);
      const xScale = d3.scalePoint<string>()
        .domain(xLabels)
        .range([0, innerWidth])
        .padding(0.3);

      const xBandScale = d3.scaleBand<string>()
        .domain(xLabels)
        .range([0, innerWidth])
        .padding(0.35);

      const maxValue = d3.max(chartData, (d) => (flowUnit === 'kv' ? d.kv : d.cv)) || 100;
      const targetVal = flowUnit === 'kv' ? requiredKv : requiredCv;
      const effectiveMaxY = Math.max(maxValue, targetVal * 1.15) * 1.12;

      const yScale = d3.scaleLinear()
        .domain([0, effectiveMaxY])
        .range([innerHeight, 0])
        .nice();

      // Grid
      const yAxisGrid = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '');

      g.append('g')
        .attr('class', 'grid-lines')
        .call(yAxisGrid)
        .selectAll('line')
        .attr('stroke', '#334155')
        .attr('stroke-dasharray', '3,3')
        .attr('stroke-opacity', 0.6);

      g.selectAll('.grid-lines .domain').remove();

      // Bars
      if (chartType === 'bar' || chartType === 'both') {
        g.selectAll('.flow-bar')
          .data(chartData)
          .enter()
          .append('rect')
          .attr('class', 'flow-bar')
          .attr('x', (d) => xBandScale(d.dn) || 0)
          .attr('y', innerHeight)
          .attr('width', xBandScale.bandwidth())
          .attr('height', 0)
          .attr('rx', 4)
          .attr('fill', flowUnit === 'kv' ? '#10b981' : '#3b82f6')
          .attr('opacity', 0.8)
          .transition()
          .duration(650)
          .attr('y', (d) => yScale(flowUnit === 'kv' ? d.kv : d.cv))
          .attr('height', (d) => innerHeight - yScale(flowUnit === 'kv' ? d.kv : d.cv));
      }

      // Curve
      if (chartType === 'curve' || chartType === 'both') {
        const areaGen = d3.area<typeof chartData[0]>()
          .x((d) => xScale(d.dn) || 0)
          .y0(innerHeight)
          .y1((d) => yScale(flowUnit === 'kv' ? d.kv : d.cv))
          .curve(d3.curveMonotoneX);

        const lineGen = d3.line<typeof chartData[0]>()
          .x((d) => xScale(d.dn) || 0)
          .y((d) => yScale(flowUnit === 'kv' ? d.kv : d.cv))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(chartData)
          .attr('fill', '#10b981')
          .attr('fill-opacity', 0.15)
          .attr('d', areaGen);

        g.append('path')
          .datum(chartData)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2.8)
          .attr('filter', 'url(#d3-glow)')
          .attr('d', lineGen);
      }

      // Required line
      if (requiredKv > 0) {
        const reqY = yScale(targetVal);
        if (reqY >= 0 && reqY <= innerHeight) {
          g.append('line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', reqY)
            .attr('y2', reqY)
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 1.8)
            .attr('stroke-dasharray', '5,4');

          g.append('text')
            .attr('x', innerWidth - 6)
            .attr('y', reqY - 6)
            .attr('text-anchor', 'end')
            .attr('fill', '#f59e0b')
            .attr('font-size', '10px')
            .attr('font-mono', 'true')
            .attr('font-weight', 'bold')
            .text(`Kv yêu cầu: ${targetVal}`);
        }
      }

      // Axes
      const xAxis = d3.axisBottom(xScale);
      const xAxisG = g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);
      xAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '10px');
      xAxisG.select('.domain').attr('stroke', '#475569');

      const yAxis = d3.axisLeft(yScale).ticks(5);
      const yAxisG = g.append('g').attr('class', 'y-axis').call(yAxis);
      yAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '10px');
      yAxisG.select('.domain').attr('stroke', '#475569');
    }

  }, [chartData, activeMode, chartType, flowUnit, targetFlowQ, pressureDropDeltaP, fluidDensity, requiredKv, requiredCv, recommendedSpec, selectedDnHighlight, lang]);

  return (
    <div ref={containerRef} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top Header with Visual Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                {lang === 'vi' ? 'Biểu Đồ Thủy Lực D3.js: Độ Giảm Áp & Lưu Lượng' : 'D3.js Valve Hydraulic & Sizing Chart'}
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-600/60 px-2 py-0.2 rounded font-bold">
                Kv Engineering
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'vi' 
                ? 'Tính toán chính xác tổn thất áp lực ΔP = (Q/Kv)² và tư vấn kích thước van tối ưu theo tiêu chuẩn' 
                : 'Interactive ΔP = (Q/Kv)² pressure drop curves for optimal pipeline size selection'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('dp_vs_q')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'dp_vs_q'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Độ Giảm Áp vs Lưu Lượng (ΔP - Q)' : 'ΔP vs Flow Rate'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('kv_distribution')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'kv_distribution'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Phân Bố Kv / Cv' : 'Kv by Size'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Sizing Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs items-center">
        {/* Target Flow Rate Q */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Lưu lượng làm việc Q:' : 'Design Flow Q:'}</span>
            <span className="font-mono font-bold text-amber-400">{targetFlowQ} m³/h</span>
          </label>
          <input
            type="range"
            min="10"
            max="1200"
            step="10"
            value={targetFlowQ}
            onChange={(e) => setTargetFlowQ(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Allowable Delta P */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Độ giảm áp cho phép ΔP:' : 'Target Allowable ΔP:'}</span>
            <span className="font-mono font-bold text-amber-400">{pressureDropDeltaP} bar</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="0.80"
            step="0.05"
            value={pressureDropDeltaP}
            onChange={(e) => setPressureDropDeltaP(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Fluid Selection */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-300">
            {lang === 'vi' ? 'Môi chất đường ống:' : 'Pipeline Fluid:'}
          </label>
          <select
            value={fluidType}
            onChange={(e) => setFluidType(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="water">Nước sạch 20°C (SG = 1.0)</option>
            <option value="chilled_water">Nước lạnh Chiller 5°C (SG = 1.02)</option>
            <option value="hot_water">Nước nóng lò hơi 95°C (SG = 0.96)</option>
            <option value="oil">Dầu công nghiệp / DO (SG = 0.88)</option>
            <option value="steam">Hơi bão hòa (Vapor equivalent)</option>
          </select>
        </div>

        {/* Recommended Result Pill */}
        <div className="bg-emerald-950/60 border border-emerald-500/60 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">
              {lang === 'vi' ? 'Kích thước van khuyên dùng:' : 'Optimal Size:'}
            </span>
            <span className="text-sm font-mono font-black text-white">
              {recommendedSpec ? `${recommendedSpec.dn} (Kv=${recommendedSpec.kv})` : 'DN100'}
            </span>
          </div>
        </div>
      </div>

      {/* SVG D3 Chart Display Area */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex justify-center py-2">
        <svg
          ref={svgRef}
          viewBox="0 0 640 310"
          className="w-full h-auto max-h-[320px] select-none"
        />

        {/* Dynamic Watermark / Brand */}
        <div className="absolute top-2 right-3 pointer-events-none text-[9px] font-mono text-slate-600">
          UTDCORP D3.JS HYDRAULIC ENGINE
        </div>
      </div>

      {/* Comprehensive Size Evaluation Table (Tư vấn chọn kích thước van phù hợp) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'vi' 
              ? `Đánh Giá Tổn Thất Áp & Vận Tốc Tại Lưu Lượng ${targetFlowQ} m³/h:` 
              : `Hydraulic Loss & Velocity Assessment at ${targetFlowQ} m³/h:`}
          </span>
          <span className="text-[11px] text-slate-400">
            {lang === 'vi' ? 'Công thức: ΔP = (Q/Kv)² • v = Q / (3600 × Area)' : 'Formula: ΔP = (Q/Kv)² • v = Q / (3600 × A)'}
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-2.5 text-center">Kích thước</th>
                <th className="p-2.5 text-center">Hệ số Kv (m³/h)</th>
                <th className="p-2.5 text-center">Độ giảm áp ΔP thực tế</th>
                <th className="p-2.5 text-center">Vận tốc dòng chảy (v)</th>
                <th className="p-2.5 text-left">Đánh giá kỹ thuật của chuyên viên UTDCORP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950 font-mono text-xs">
              {sizingEvaluation.map((item) => {
                const isOptimal = item.status === 'optimal';
                const isTooSmall = item.status === 'too_small';

                return (
                  <tr
                    key={item.dn}
                    onClick={() => setSelectedDnHighlight(selectedDnHighlight === item.dn ? null : item.dn)}
                    className={`cursor-pointer transition-colors ${
                      isOptimal 
                        ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-200' 
                        : isTooSmall 
                        ? 'hover:bg-rose-950/20 text-slate-300' 
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <td className="p-2.5 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        isOptimal ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-200'
                      }`}>
                        {item.dn}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-300">{item.kv}</td>
                    <td className="p-2.5 text-center font-bold">
                      <span className={
                        item.actualDp > 0.5 ? 'text-rose-400' : (item.actualDp < 0.05 ? 'text-blue-300' : 'text-emerald-400')
                      }>
                        {item.actualDp} bar ({Math.round(item.actualDp * 100)} kPa)
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={item.velocityMs > 3.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {item.velocityMs} m/s
                      </span>
                    </td>
                    <td className="p-2.5 font-sans text-[11px]">
                      {isOptimal ? (
                        <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          {lang === 'vi' ? item.verdictVi : item.verdictEn}
                        </span>
                      ) : isTooSmall ? (
                        <span className="flex items-center gap-1.5 text-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          {lang === 'vi' ? item.verdictVi : item.verdictEn}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {lang === 'vi' ? item.verdictVi : item.verdictEn}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
