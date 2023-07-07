import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { memo } from "react";

import { moneyFormatter } from "@lib/utils";

const Chart = memo(function Chart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Tooltip
          animationDuration={500}
          contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "#333" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const result = (Math.round((payload[0].value as number) * 100) / 100).toFixed(2);
              return moneyFormatter.format(Number(result)).replace("€", "NEOK");
            }
          }}
        />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "NEOK", position: "insideTopLeft" }} tick={false} mirror={true} />
        <Line type="monotone" dataKey="minted" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default Chart;
