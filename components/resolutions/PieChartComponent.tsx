/* eslint-disable react/display-name */
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

import { Theme, useTheme } from "@mui/material";

const renderActiveShape = (theme: Theme, abstained: number, isNegative: boolean) => (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent, value, name } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={theme.palette.text.primary} fontWeight="bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.color}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.color} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={theme.palette.text.primary}>
        {`${value.toLocaleString()}`} {`(${(percent * 100).toFixed(2)}%)`}
      </text>
      {payload.name === "Against" && (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill={theme.palette.text.secondary}
        >
          Of which {abstained.toLocaleString()} abstained
        </text>
      )}
    </g>
  );
};

export default function PieChartComponent({
  data,
  activeIndex,
  setActiveIndex,
  abstained,
  isNegative,
}: {
  data: Array<{ value: number; name: string; color: string }>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  abstained: number;
  isNegative: boolean;
}) {
  const theme = useTheme();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape(theme, abstained, isNegative)}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={120}
          fill={activeIndex === 0 ? data[1].color : data[0].color}
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
