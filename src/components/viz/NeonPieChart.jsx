import React, { useState } from 'react';

const NeonPieChart = ({ data, colors }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const total = Object.values(data).reduce((a, b) => a + b, 0);
    let currentAngle = 0;

    const slices = Object.keys(data).map((key, i) => {
        const value = data[key];
        const percentage = (value / total) * 100;
        const angle = (value / total) * 360;

        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle += angle;

        // Calculate path
        const radius = 120;
        const x1 = 150 + radius * Math.cos(Math.PI * startAngle / 180);
        const y1 = 150 + radius * Math.sin(Math.PI * startAngle / 180);
        const x2 = 150 + radius * Math.cos(Math.PI * endAngle / 180);
        const y2 = 150 + radius * Math.sin(Math.PI * endAngle / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;
        const pathData = [
            `M 150 150`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
        ].join(' ');

        // Calculate label position (centroid)
        const midAngle = startAngle + angle / 2;
        const labelRadius = radius * 0.7;
        const labelX = 150 + labelRadius * Math.cos(Math.PI * midAngle / 180);
        const labelY = 150 + labelRadius * Math.sin(Math.PI * midAngle / 180);

        return {
            key,
            value,
            percentage,
            pathData,
            color: colors[i % colors.length],
            labelX,
            labelY,
            midAngle
        };
    });

    return (
        <div className="relative w-[300px] h-[300px] mx-auto">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {slices.map((slice, i) => (
                    <g
                        key={slice.key}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            transformOrigin: '150px 150px',
                            transform: hoveredIndex === i ? `scale(1.05)` : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <path
                            d={slice.pathData}
                            fill={slice.color}
                            stroke="#050505"
                            strokeWidth="2"
                            filter={hoveredIndex === i ? "url(#glow)" : ""}
                            className="transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100"
                        />
                    </g>
                ))}

                {/* Labels Layer - Rendered after slices to be on top */}
                {slices.map((slice, i) => (
                    <g key={`label-${i}`} className="pointer-events-none">
                        <text
                            x={slice.labelX}
                            y={slice.labelY}
                            textAnchor="middle"
                            dy="-0.2em"
                            fill="#000"
                            className="text-[10px] font-bold font-mono"
                            style={{ textShadow: '0 0 2px rgba(255,255,255,0.5)' }}
                        >
                            {Math.round(slice.percentage)}%
                        </text>
                        <text
                            x={slice.labelX}
                            y={slice.labelY}
                            textAnchor="middle"
                            dy="1em"
                            fill="#000"
                            className="text-[8px] font-bold font-mono"
                        >
                            ${(slice.value / 1000).toFixed(0)}k
                        </text>
                    </g>
                ))}

                {/* Center Hole for Donut Effect (Optional, user asked for Pie but Donut looks more 'tech') 
            Actually, let's keep it a full pie as requested, but maybe a small tech core?
            User said "Pie chart", but "Hardware module" aesthetic implies maybe a donut.
            I'll stick to full pie for maximum readability of the "slices" but add a small tech center.
        */}
                <circle cx="150" cy="150" r="15" fill="#050505" stroke="#333" strokeWidth="1" />
                <circle cx="150" cy="150" r="5" fill="#00f0ff" className="animate-pulse" />

            </svg>

            {/* Legend / Tooltip could go here, but labels are on chart now */}
        </div>
    );
};

export default NeonPieChart;
