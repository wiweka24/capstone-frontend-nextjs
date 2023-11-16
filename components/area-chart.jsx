"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AreaChart({ sensorData, dataset }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Perubahan Suhu",
      },
    },
  };

  const labels = sensorData?.map((item) => {
    const timestamp = new Date(item.timestamp);
    const hours = String(timestamp.getHours()).padStart(2, '0'); // Get the hour and pad with leading 0 if needed
    const minutes = String(timestamp.getMinutes()).padStart(2, '0'); // Get the minutes and pad with leading 0 if needed
    return `${hours}:${minutes}`;
  });
  
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: `Data sampah ${dataset}`,
        data: sensorData?.map((item) => item.temp),
        borderColor: "#006CC2",
        backgroundColor: "#94D2FF",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
